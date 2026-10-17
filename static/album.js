(async () => {
  const authCard = document.querySelector("#album-auth-card");
  if (!authCard) return;

  const authCopy = document.querySelector("#album-auth-copy");
  const authStatus = document.querySelector("#album-auth-status");
  const loginForm = document.querySelector("#album-login-form");
  const loginButton = document.querySelector("#album-login-button");
  const privateArea = document.querySelector("#album-private-area");
  const uploadForm = document.querySelector("#album-upload-form");
  const fileInput = document.querySelector("#album-files");
  const captionInput = document.querySelector("#album-caption");
  const uploadButton = document.querySelector("#album-upload-button");
  const uploadStatus = document.querySelector("#album-upload-status");
  const albumGrid = document.querySelector("#shared-album-grid");
  const albumEmpty = document.querySelector("#album-empty");
  const itemCount = document.querySelector("#album-item-count");
  const signedInAs = document.querySelector("#album-signed-in-as");
  const refreshButton = document.querySelector("#album-refresh");
  const signOutButton = document.querySelector("#album-sign-out");
  const maxFileSize = 25 * 1024 * 1024;
  const maxFileCount = 10;
  const allowedMimeTypes = new Set([
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "video/mp4", "video/webm", "video/quicktime"
  ]);
  if (!window.supabase) {
    throw new Error("The Supabase browser library did not load. Check your internet connection and refresh.");
  }

  const configResponse = await fetch("/api/config", {
    headers: { Accept: "application/json" }
  });
  const contentType = configResponse.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    const responseBody = (await configResponse.text()).replace(/\s+/g, " ").slice(0, 160);
    const requestUrl = new URL("/api/config", window.location.href);
    throw new Error(
      `GET ${requestUrl.href} returned HTTP ${configResponse.status} (${contentType || "unknown content type"}), not JSON. Response: ${responseBody || "(empty response)"}`
    );
  }

  let config;
  try {
    config = await configResponse.json();
  } catch (error) {
    throw new Error(`GET /api/config returned invalid JSON: ${error.message}`);
  }

  if (!configResponse.ok || !config.configured) {
    throw new Error(config.message || "Supabase is not configured on this server.");
  }

  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw new Error("Supabase URL or publishable key is missing from the server configuration.");
  }

  const supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
  let currentUser;
  let activeUserId;
  let albumChannel;
  let loadingLibrary = false;

  const showAuthMessage = (message, isError = false) => {
    authStatus.textContent = message;
    authStatus.classList.toggle("is-error", isError);
  };

  const showUploadMessage = (message, isError = false) => {
    uploadStatus.textContent = message;
    uploadStatus.classList.toggle("is-error", isError);
  };

  const setSignedIn = (user) => {
    currentUser = user;
    authCard.hidden = Boolean(user);
    privateArea.hidden = !user;
    if (user) {
      signedInAs.textContent = `Signed in as ${user.email}`;
      showUploadMessage("");
      if (activeUserId !== user.id) {
        activeUserId = user.id;
        if (albumChannel) supabaseClient.removeChannel(albumChannel);
        albumChannel = supabaseClient
          .channel("couple-shared-album")
          .on("postgres_changes", {
            event: "*",
            schema: "public",
            table: "album_memories"
          }, () => loadAlbum())
          .subscribe((status) => {
            if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
              showUploadMessage("Live updates are temporarily unavailable. Use Refresh to check for new memories.", true);
            }
          });
      }
      loadAlbum();
    } else {
      activeUserId = undefined;
      if (albumChannel) {
        supabaseClient.removeChannel(albumChannel);
        albumChannel = undefined;
      }
      albumGrid.replaceChildren();
      albumEmpty.hidden = true;
      itemCount.textContent = "Sign in to view";
      signedInAs.textContent = "";
      fileInput.value = "";
    }
  };

  const verifyMembership = async (user) => {
    const { data, error } = await supabaseClient
      .from("album_members")
      .select("user_id, display_name")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      await supabaseClient.auth.signOut();
      throw new Error("This account hasn't been invited to your private album yet. Ask the album owner to add your account.");
    }
    signedInAs.textContent = `Signed in as ${data.display_name} · ${user.email}`;
  };

  const loadAlbum = async () => {
    if (!currentUser || loadingLibrary) return;
    loadingLibrary = true;
    refreshButton.disabled = true;
    itemCount.textContent = "Loading…";
    try {
      const { data: memories, error } = await supabaseClient
        .from("album_memories")
        .select("id, storage_path, media_type, caption, created_by, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const cards = await Promise.all(memories.map(async (memory) => {
        const { data: signedUrl, error: urlError } = await supabaseClient
          .storage.from("couple-album")
          .createSignedUrl(memory.storage_path, 3600);
        if (urlError) throw urlError;

        const card = document.createElement("article");
        card.className = "album-memory-card";
        const media = memory.media_type === "video"
          ? document.createElement("video")
          : document.createElement("img");
        media.className = "album-memory-media";
        media.src = signedUrl.signedUrl;
        if (memory.media_type === "video") {
          media.controls = true;
          media.playsInline = true;
          media.preload = "metadata";
          media.setAttribute("aria-label", memory.caption || "A shared video memory");
        } else {
          media.alt = memory.caption || "A shared photo memory";
          media.loading = "lazy";
        }
        card.append(media);

        const details = document.createElement("div");
        details.className = "album-memory-details";
        const caption = document.createElement("p");
        caption.className = "album-memory-caption";
        caption.textContent = memory.caption || "A little moment, saved together. ♡";
        const date = document.createElement("time");
        date.className = "album-memory-date";
        date.dateTime = memory.created_at;
        date.textContent = new Intl.DateTimeFormat("en-IN", {
          dateStyle: "medium",
          timeStyle: "short"
        }).format(new Date(memory.created_at));
        details.append(caption, date);

        const removeButton = document.createElement("button");
        removeButton.className = "album-delete-button";
        removeButton.type = "button";
        removeButton.textContent = "Delete";
        removeButton.setAttribute("aria-label", `Delete ${memory.media_type} memory`);
        removeButton.addEventListener("click", () => deleteMemory(memory, removeButton));
        details.append(removeButton);
        card.append(details);
        return card;
      }));

      albumGrid.replaceChildren(...cards);
      itemCount.textContent = `${memories.length} ${memories.length === 1 ? "moment" : "moments"}`;
      albumEmpty.hidden = memories.length > 0;
      if (!memories.length) albumEmpty.hidden = false;
    } catch (error) {
      itemCount.textContent = "Could not load";
      showUploadMessage(`Couldn't load the shared album: ${error.message}`, true);
    } finally {
      refreshButton.disabled = false;
      loadingLibrary = false;
    }
  };

  const deleteMemory = async (memory, button) => {
    if (!window.confirm("Delete this shared memory for both of you? This can't be undone.")) return;
    button.disabled = true;
    showUploadMessage("Removing this memory…");
    try {
      const { error: rowError } = await supabaseClient
        .from("album_memories")
        .delete()
        .eq("id", memory.id);
      if (rowError) {
        button.disabled = false;
        showUploadMessage(`Couldn't delete this memory: ${rowError.message}`, true);
        return;
      }

      const { error: fileError } = await supabaseClient
        .storage.from("couple-album")
        .remove([memory.storage_path]);
      if (fileError) {
        showUploadMessage(`The memory was removed from the album, but its stored file couldn't be cleaned up: ${fileError.message}`, true);
      } else {
        showUploadMessage("Memory deleted from your shared album. ♡");
      }
      await loadAlbum();
    } catch (error) {
      button.disabled = false;
      showUploadMessage(`Couldn't finish deleting this memory: ${error.message}`, true);
    }
  };

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginButton.disabled = true;
    showAuthMessage("Signing in to your private album…");
    const email = loginForm.elements.email.value.trim();
    const password = loginForm.elements.password.value;
    let data;
    let error;
    try {
      ({ data, error } = await supabaseClient.auth.signInWithPassword({ email, password }));
    } catch (requestError) {
      showAuthMessage(`Couldn't sign in: ${requestError.message}`, true);
      loginButton.disabled = false;
      return;
    }
    if (error) {
      showAuthMessage(`Couldn't sign in: ${error.message}`, true);
      loginButton.disabled = false;
      return;
    }
    try {
      await verifyMembership(data.user);
      showAuthMessage("Welcome to your shared scrapbook. ♡");
      setSignedIn(data.user);
    } catch (membershipError) {
      showAuthMessage(membershipError.message, true);
    } finally {
      loginButton.disabled = false;
    }
  });

  uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const files = [...fileInput.files];
    if (!currentUser) {
      showUploadMessage("Please sign in before adding a memory.", true);
      return;
    }
    if (!files.length) {
      showUploadMessage("Choose at least one photo or video first.", true);
      return;
    }
    if (files.length > maxFileCount) {
      showUploadMessage(`Choose up to ${maxFileCount} files at a time.`, true);
      return;
    }
    const invalidFile = files.find((file) => !allowedMimeTypes.has(file.type) || file.size > maxFileSize);
    if (invalidFile) {
      showUploadMessage(`${invalidFile.name} is unsupported or larger than 25 MB. Choose JPG, PNG, WEBP, GIF, MP4, WEBM or MOV files up to 25 MB each.`, true);
      return;
    }

    uploadButton.disabled = true;
    showUploadMessage(`Adding ${files.length === 1 ? "your memory" : `${files.length} memories`}…`);
    let uploadedCount = 0;
    const failures = [];
    const caption = captionInput.value.trim();
    try {
      for (const file of files) {
        const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
        const storagePath = `${currentUser.id}/${crypto.randomUUID()}.${extension}`;
        const mediaType = file.type.startsWith("video/") ? "video" : "image";
        const { error: storageError } = await supabaseClient.storage
          .from("couple-album")
          .upload(storagePath, file, { contentType: file.type, upsert: false });
        if (storageError) {
          failures.push(`${file.name}: ${storageError.message}`);
          continue;
        }

        const { error: insertError } = await supabaseClient
          .from("album_memories")
          .insert({
            storage_path: storagePath,
            media_type: mediaType,
            caption,
            created_by: currentUser.id
          });
        if (insertError) {
          const { error: cleanupError } = await supabaseClient.storage.from("couple-album").remove([storagePath]);
          failures.push(`${file.name}: ${insertError.message}${cleanupError ? ` (cleanup also failed: ${cleanupError.message})` : ""}`);
          continue;
        }
        uploadedCount += 1;
      }

      if (uploadedCount) {
        uploadForm.reset();
        await loadAlbum();
      }
      if (failures.length) {
        const detail = failures.slice(0, 2).join(" · ");
        showUploadMessage(
          `${uploadedCount} added. ${failures.length} couldn't be uploaded: ${detail}${failures.length > 2 ? ` · ${failures.length - 2} more failed.` : ""}`,
          true
        );
      } else {
        showUploadMessage(`${uploadedCount} ${uploadedCount === 1 ? "memory" : "memories"} added for both of you. ♡`);
      }
    } catch (error) {
      showUploadMessage(`Upload stopped: ${error.message}. ${uploadedCount} file(s) had already been added.`, true);
      if (uploadedCount) await loadAlbum();
    } finally {
      uploadButton.disabled = false;
    }
  });

  refreshButton.addEventListener("click", loadAlbum);
  signOutButton.addEventListener("click", async () => {
    signOutButton.disabled = true;
    const { error } = await supabaseClient.auth.signOut();
    signOutButton.disabled = false;
    if (error) {
      showUploadMessage(`Couldn't sign out: ${error.message}`, true);
      return;
    }
    setSignedIn(null);
    showAuthMessage("Signed out. Your shared album is private. ♡");
  });

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    if (!session?.user) {
      setSignedIn(null);
      return;
    }
    window.setTimeout(async () => {
      try {
        await verifyMembership(session.user);
        setSignedIn(session.user);
      } catch (error) {
        showAuthMessage(error.message, true);
      }
    }, 0);
  });

  supabaseClient.auth.getSession().then(async ({ data, error }) => {
    if (error) {
      showAuthMessage(`Couldn't restore your sign-in: ${error.message}`, true);
      return;
    }
    if (!data.session?.user) return;
    try {
      await verifyMembership(data.session.user);
      setSignedIn(data.session.user);
    } catch (membershipError) {
      showAuthMessage(membershipError.message, true);
    }
  });
})().catch((error) => {
  const authCopy = document.querySelector("#album-auth-copy");
  const authStatus = document.querySelector("#album-auth-status");
  if (!authStatus) return;
  if (authCopy) {
    authCopy.textContent = "The rest of the scrapbook still works; the shared album needs its Supabase configuration.";
  }
  authStatus.textContent = error.message;
  authStatus.classList.add("is-error");
});
