document.addEventListener("DOMContentLoaded", function () {
  const videoPlayer = document.getElementById("videoPlayer");
  const videoLinkInput = document.getElementById("videoLinkInput");
  const trashIcon = document.getElementById("trashIcon");
  const okButton = document.getElementById("okButton");
  const muteToggleBtn = document.getElementById("muteToggleBtn");
  const speedToggleBtn = document.getElementById("speedToggleBtn");
  const darkModeToggleBtn = document.getElementById("darkModeToggleBtn");
  const darkOverlay = document.getElementById("darkOverlay");
  const modal = document.getElementById("modal");
  const closeButton = document.getElementById("closeButton");
  const modalOverlay = document.getElementById("modalOverlay");

  let isMuted = false;
  let isDarkModeOn = false;
  let isSpeedChanged = false;
  let currentSpeed = 1; // Initialize with normal speed
  const MAX_SPEED = 10000; // Set maximum speed
  let videoPlaying = false;

  okButton.addEventListener("click", function () {
    const videoLink = videoLinkInput.value;
    if (videoLink) {
      const convertedLink = convertDropboxLink(videoLink);
      videoLinkInput.value = convertedLink; // Update input field with converted link
      videoPlayer.src = convertedLink;
      videoPlayer.play();
      videoPlaying = true;
      currentSpeed = 10; // Set initial speed
      applySpeed(currentSpeed); // Apply speed settings
      videoPlayer.muted = true; // Mute the video
      isMuted = true;
      updateMuteIcon(); // Update mute icon
      isSpeedChanged = true;
      speedToggleBtn.classList.add('speedOn'); // Update speed icon
      videoLinkInput.disabled = true;
      okButton.disabled = true;
      videoPlayer.addEventListener('ended', function () {
        videoPlaying = false;
        showEndNotification();
      });
    }
  });

  trashIcon.addEventListener("click", function () {
    if (!videoPlaying) {
      videoLinkInput.value = ""; // Clear the input field
      videoLinkInput.disabled = false;
      okButton.disabled = false;

      // Add 'clicked' class to change color
      trashIcon.classList.add('clicked');
      
      // Remove 'clicked' class after 500 ms
      setTimeout(function() {
        trashIcon.classList.remove('clicked');
      }, 500);
    }
  });

  muteToggleBtn.addEventListener("click", function () {
    isMuted = !isMuted;
    videoPlayer.muted = isMuted;
    updateMuteIcon(); // Update mute icon and class
  });

  speedToggleBtn.addEventListener("click", function () {
    if (isSpeedChanged) {
      // Reset to normal speed
      currentSpeed = 1;
      isSpeedChanged = false;
    } else {
      // Increase speed by a factor of 10
      currentSpeed *= 10;
      if (currentSpeed > MAX_SPEED) currentSpeed = MAX_SPEED; // Ensure the rate doesn't exceed the maximum
      isSpeedChanged = true;
    }
    applySpeed(currentSpeed);
    speedToggleBtn.classList.toggle('speedOn', isSpeedChanged);
  });

  darkModeToggleBtn.addEventListener("click", function () {
    toggleDarkMode();
  });

  darkOverlay.addEventListener("click", function () {
    toggleDarkMode();
  });

  closeButton.addEventListener("click", function () {
    hideModal();
    modalOverlay.style.display = "none";
    document.body.style.pointerEvents = "auto"; // Re-enable page interactions
    okButton.disabled = false; // Re-enable the OK button
    videoLinkInput.disabled = false; // Re-enable the video link input
  });

  function applySpeed(rate) {
    videoPlayer.playbackRate = rate;
  }

  function updateMuteIcon() {
    const icon = muteToggleBtn.querySelector('i');
    icon.textContent = isMuted ? 'volume_off' : 'volume_up';
    muteToggleBtn.classList.toggle('soundOn', isMuted);
  }

  function toggleDarkMode() {
    isDarkModeOn = !isDarkModeOn;
    document.body.style.backgroundColor = isDarkModeOn ? "#333" : "";
    darkOverlay.style.display = isDarkModeOn ? "block" : "none";
    darkModeToggleBtn.classList.toggle('darkOn', isDarkModeOn);
  }

  function showEndNotification() {
    modalOverlay.style.display = "block";
    modal.style.display = "block";
    document.body.style.pointerEvents = "none"; // Disable page interactions

    // Reset video settings
    videoPlayer.muted = false;
    isMuted = false;
    updateMuteIcon(); // Update mute icon
    currentSpeed = 1;
    applySpeed(currentSpeed);
    isSpeedChanged = false;
    speedToggleBtn.classList.remove('speedOn');
    speedToggleBtn.querySelector('i').textContent = 'speed'; // Reset icon if needed
  }

  function hideModal() {
    modal.style.display = "none";
  }

  function convertDropboxLink(link) {
    return link.replace("www.dropbox.com", "dl.dropboxusercontent.com");
  }
});
