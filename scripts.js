/**
 * Ayilara Madathil Sree Bhadra Bhagavathi Temple - Core Web App Scripts
 * Fully structured, optimized, and responsive logic.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize general utilities
  initLazyLoading();
  initDateConstraints();
  initDevotionalChantAnim();
  initFlashAd();
  initHeroSlider();
  initGalleryLightbox();
  initBhajanPlayer();
  initBookingForm();
});

// Global state variables
let currentLanguage = 'en'; // 'en' or 'ml'
let slideIndex = 0;
let sliderInterval = null;
let lightboxIndex = 0;
const galleryImages = [];

/**
 * ==========================================================================
 * 1. LAZY LOADING IMAGES
 * ==========================================================================
 */
function initLazyLoading() {
  const lazyImages = [...document.querySelectorAll("img.lazy")];

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => {
            img.style.background = "none";
            img.classList.remove("lazy");
          };
          obs.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => observer.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.onload = () => {
        img.style.background = "none";
      };
    });
  }
}

/**
 * ==========================================================================
 * 2. DATE LIMIT & PICKER SETUP
 * ==========================================================================
 */
function initDateConstraints() {
  const today = new Date().toISOString().split("T")[0];
  const dateField = document.getElementById("date");
  if (dateField) {
    dateField.setAttribute("min", today);
  }
}

/**
 * ==========================================================================
 * 3. DEVOTIONAL CHANT ANIMATION
 * ==========================================================================
 */
function initDevotionalChantAnim() {
  const chant = document.getElementById("chantText");
  if (chant) {
    setTimeout(() => {
      chant.style.transition = "opacity 2.5s ease-in-out";
      chant.style.opacity = 1;
    }, 800);
  }
}

/**
 * ==========================================================================
 * 4. FLASH AD INTERSTITIAL MODAL
 * ==========================================================================
 */
function initFlashAd() {
  const flash = document.getElementById("flashAd");
  const closeBtn = document.getElementById("closeFlash");

  if (!flash) return;

  // Show the popup after a brief 2 second delay
  setTimeout(() => {
    flash.classList.add("show");
  }, 2000);

  // Close ad clicking close button
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      flash.classList.remove("show");
    });
  }

  // Click on the promotion image -> Close flash and open booking popup in donation-only mode
  const flashImg = flash.querySelector("img");
  if (flashImg) {
    flashImg.addEventListener("click", (e) => {
      e.stopPropagation();
      flash.classList.remove("show");
      
      // Open booking
      openBooking();
      
      // Auto-toggle to donation only mode
      const donateCheckbox = document.getElementById("donateOnly");
      if (donateCheckbox) {
        donateCheckbox.checked = true;
        togglePooja();
      }
    });
  }

  // Prevent closing when clicking inside the window content
  flash.addEventListener("click", (e) => {
    if (e.target === flash) {
      e.stopPropagation();
    }
  });
}

/**
 * ==========================================================================
 * 5. HERO SLIDER LOGIC
 * ==========================================================================
 */
function initHeroSlider() {
  const slides = document.querySelectorAll(".slide");
  const slider = document.querySelector(".slider");
  if (!slider || slides.length === 0) return;

  function showNextSlide() {
    slides[slideIndex].classList.remove("active");
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add("active");
  }

  // Start automatic transitions
  sliderInterval = setInterval(showNextSlide, 4000);

  // Pause on hover, resume on mouse leave
  slider.addEventListener("mouseenter", () => clearInterval(sliderInterval));
  slider.addEventListener("mouseleave", () => {
    sliderInterval = setInterval(showNextSlide, 4000);
  });
}

/**
 * ==========================================================================
 * 6. GALLERY & LIGHTBOX MODAL
 * ==========================================================================
 */
function initGalleryLightbox() {
  const imgs = document.querySelectorAll(".gallery img");
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImg = document.getElementById("lightboxImg");

  if (!lightbox || !lightboxImg) return;

  // Cache images and bind click events
  imgs.forEach((img, i) => {
    galleryImages.push(img);
    img.addEventListener("click", () => {
      lightboxIndex = i;
      openLightbox();
    });
  });
}

function openLightbox() {
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const targetImg = galleryImages[lightboxIndex];

  if (lightbox && lightboxImg && targetImg) {
    lightboxImg.src = targetImg.src ? targetImg.src : targetImg.dataset.src;
    lightbox.style.display = "flex";
  }
}

function closeLightbox() {
  const lightbox = document.getElementById("galleryLightbox");
  if (lightbox) {
    lightbox.style.display = "none";
  }
}

function navigateLightbox(dir) {
  if (galleryImages.length === 0) return;
  lightboxIndex = (lightboxIndex + dir + galleryImages.length) % galleryImages.length;
  openLightbox();
}

// Close lightbox on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") navigateLightbox(-1);
  if (e.key === "ArrowRight") navigateLightbox(1);
});

/**
 * ==========================================================================
 * 7. BHAJAN DEVOTIONAL AUDIO CONTROLS
 * ==========================================================================
 */
function initBhajanPlayer() {
  const audio = document.getElementById("bhajanAudio");
  const btn = document.getElementById("bhajanBtn");
  if (!audio || !btn) return;

  // Autoplay fallback: start playing on the first click in the DOM
  document.body.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => {
        btn.innerText = "⏸";
      }).catch(() => {});
    }
  }, { once: true });

  // Toggle button actions
  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      btn.innerText = "⏸";
    } else {
      audio.pause();
      btn.innerText = "🔊";
    }
  });
}

/**
 * ==========================================================================
 * 8. POOJA BOOKING FORM & SUMMARY CALCULATIONS
 * ==========================================================================
 */
function initBookingForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  // Bind change and input listeners for dynamic calculations
  const triggers = ["pooja", "donationAmount", "name", "date", "nakshatra", "address"];
  triggers.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", updateSummary);
      el.addEventListener("change", updateSummary);
    }
  });

  // Setup Scan QR Link action in the Donation card
  const qrLink = document.getElementById("qrPayLink");
  if (qrLink) {
    qrLink.onclick = () => {
      const upiID = "118924144014105@cnrb";
      window.location.href = `upi://pay?pa=${upiID}&pn=Ayilara%20Madathil%20Temple&cu=INR`;
    };
  }

  // Bind booking form submit
  form.addEventListener("submit", processBookingSubmission);

  // Initialize summary calculations
  updateSummary();
}

function openBooking() {
  const popup = document.getElementById("bookingPopup");
  if (popup) {
    popup.style.display = "block";
    togglePooja();
    updateSummary();
  }
}

function closeBooking() {
  const popup = document.getElementById("bookingPopup");
  if (popup) {
    popup.style.display = "none";
  }
}

function closeSuccess() {
  const popup = document.getElementById("successPopup");
  if (popup) {
    popup.style.display = "none";
  }
}

function togglePooja() {
  const donateOnly = document.getElementById("donateOnly").checked;
  const poojaSec = document.getElementById("poojaSection");
  const donationAmtSec = document.getElementById("donationAmountSection");
  const donationInput = document.getElementById("donationAmount");

  if (donateOnly) {
    if (poojaSec) poojaSec.style.display = "none";
    if (donationAmtSec) donationAmtSec.style.display = "block";
  } else {
    if (poojaSec) poojaSec.style.display = "block";
    if (donationAmtSec) donationAmtSec.style.display = "none";
    if (donationInput) donationInput.value = "";
  }
  updateSummary();
}

function updateSummary() {
  const donateOnly = document.getElementById("donateOnly")?.checked;
  const nakshatraField = document.getElementById("nakshatra");
  const nakshatraText = nakshatraField?.selectedOptions[0]?.text || "Not Selected";

  const poojaField = document.getElementById("pooja");
  const poojaAmt = parseInt(poojaField?.selectedOptions[0]?.dataset.amount || 0);

  let donationAmt = parseInt(document.getElementById("donationAmount")?.value || 0);
  if (isNaN(donationAmt) || donationAmt < 0) donationAmt = 0;

  const name = document.getElementById("name")?.value.trim() || "Not Provided";
  const address = document.getElementById("address")?.value.trim() || "Not Provided";
  const date = document.getElementById("date")?.value || "Not Selected";

  const total = donateOnly ? donationAmt : poojaAmt;
  const totalDisplay = document.getElementById("totalAmount");
  if (totalDisplay) {
    totalDisplay.innerText = total;
  }

  const summaryText = document.getElementById("summaryText");
  if (summaryText) {
    if (donateOnly) {
      summaryText.innerHTML = `
        <strong>Name:</strong> ${name}<br>
        <strong>Address:</strong> ${address}<br>
        <strong>Donation:</strong> ₹${donationAmt}
      `;
    } else {
      const poojaText = poojaField?.selectedOptions[0]?.text.split('-')[0] || "None Selected";
      summaryText.innerHTML = `
        <strong>Name:</strong> ${name}<br>
        <strong>Address:</strong> ${address}<br>
        <strong>Date:</strong> ${date}<br>
        <strong>Nakshatra:</strong> 🌟 ${nakshatraText}<br>
        <strong>Pooja:</strong> ${poojaText}<br>
        <strong>Amount:</strong> ₹${total}
      `;
    }
  }
}

/**
 * ==========================================================================
 * 9. FORM SUBMISSION, UPI LINK GENERATION & WHATSAPP
 * ==========================================================================
 */
function processBookingSubmission(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim() || "Not Provided";
  const date = document.getElementById("date").value;
  const total = Number(document.getElementById("totalAmount").innerText) || 0;

  const donateOnly = document.getElementById("donateOnly").checked;
  const poojaField = document.getElementById("pooja");
  const poojaText = poojaField?.selectedOptions[0]?.text.split('-')[0].trim() || "";
  const nakshatraField = document.getElementById("nakshatra");
  const nakshatraText = nakshatraField?.selectedOptions[0]?.text.trim() || "";

  const upiID = "118924144014105@cnrb";
  const templePhone = "919633559256";

  // Data Validations
  if (!name) {
    alert(currentLanguage === 'en' ? "Please enter your name" : "ദയവായി പേര് നൽകുക");
    return;
  }

  if (!date && !donateOnly) {
    alert(currentLanguage === 'en' ? "Please select a booking date" : "ദയവായി തീയതി തിരഞ്ഞെടുക്കുക");
    return;
  }

  if (total <= 0 || isNaN(total)) {
    alert(currentLanguage === 'en' ? "Please enter a valid payment amount" : "ദയവായി ശരിയായ തുക നൽകുക");
    return;
  }

  // Create payment reference note (Clean string with no special characters to bypass security filters)
  let cleanPoojaText = poojaText.replace(/[^a-zA-Z0-9 ]/g, "");
  let cleanStarText = (nakshatraText.split('/')[1] || nakshatraText).replace(/[^a-zA-Z0-9 ]/g, "").trim();
  let cleanName = name.replace(/[^a-zA-Z0-9 ]/g, "");
  
  const paymentNote = donateOnly
    ? `Donation ${cleanName}`
    : `Pooja ${cleanPoojaText} Star ${cleanStarText} Name ${cleanName}`;

  // Deep Link URIs
  const upiURL = `upi://pay?pa=${upiID}&pn=Ayilara%20Madathil%20Temple&am=${total}&cu=INR&tn=${encodeURIComponent(paymentNote.substring(0, 80))}`;
  const upiSafeURL = `upi://pay?pa=${upiID}&pn=Ayilara%20Madathil%20Temple&cu=INR`;

  // Render Checkout Success Popup
  const successModal = document.getElementById("successPopup");
  const successMsg = document.getElementById("successMsg");

  if (successMsg) {
    const errorGuidanceEn = `
      <p style="color:#ffb3b3; font-size:12.5px; margin-top:12px; text-align:left; border-top:1px dashed rgba(255,215,0,0.15); padding-top:10px; line-height:1.45;">
        💡 <strong>HDFC/GPay Limit Error?</strong> If 'Fast Pay' fails due to bank limits, return here and tap <strong>'Safe Pay'</strong> below, then enter ₹${total} manually in your payment app.
      </p>`;
    const errorGuidanceMl = `
      <p style="color:#ffb3b3; font-size:12.5px; margin-top:12px; text-align:left; border-top:1px dashed rgba(255,215,0,0.15); padding-top:10px; line-height:1.45;">
        💡 <strong>ബാങ്ക് ലിമിറ്റ് എറർ?</strong> 'Fast Pay' പരാജയപ്പെടുകയാണെങ്കിൽ, താഴെയുള്ള <strong>'Safe Pay'</strong> ടാപ്പ് ചെയ്ത് ₹${total} എന്നത് മാനുവലായി ടൈപ്പ് ചെയ്യുക.
      </p>`;

    successMsg.innerHTML = `
      <p style="font-size:16px; font-weight:700; color:#ffd700; margin-bottom:10px;">
        ${currentLanguage === 'en' ? 'Pooja/Donation Details Saved!' : 'വിവരങ്ങൾ വിജയകരമായി സംരക്ഷിച്ചു!'}
      </p>
      <div style="background:rgba(255,215,0,0.05); padding:10px; border-radius:8px; text-align:left; font-size:13px; border: 1px solid var(--glass-border);">
        <strong>${currentLanguage === 'en' ? 'Name' : 'പേര്'}:</strong> ${name}<br>
        ${!donateOnly ? `<strong>${currentLanguage === 'en' ? 'Pooja' : 'പൂജ'}:</strong> ${poojaText}<br>` : ''}
        <strong>${currentLanguage === 'en' ? 'Total Amount' : 'ആകെ തുക'}:</strong> ₹${total}
      </div>
      ${currentLanguage === 'en' ? errorGuidanceEn : errorGuidanceMl}
    `;
  }

  if (successModal) {
    successModal.style.display = "block";
  }

  // Set up button actions
  const payNowBtn = document.getElementById("payNowBtn");
  if (payNowBtn) {
    payNowBtn.innerText = currentLanguage === 'en' ? `💳 Fast Pay (Auto-Fill ₹${total})` : `💳 ഫാസ്റ്റ് പേ (തുക ഓട്ടോഫിൽ)`;
    payNowBtn.onclick = () => {
      const link = document.createElement("a");
      link.href = upiURL;
      link.click();
    };
  }

  const fallbackLink = document.getElementById("upiFallback");
  if (fallbackLink) {
    fallbackLink.href = upiSafeURL;
    fallbackLink.innerHTML = currentLanguage === 'en' 
      ? "🔒 Safe Pay (Type Amount Manually)" 
      : "🔒 സേഫ് പേ (തുക ടൈപ്പ് ചെയ്യുക)";
    fallbackLink.style.background = "transparent";
    fallbackLink.style.border = "1.5px solid #ffd700";
    fallbackLink.style.color = "#ffd700";
    fallbackLink.style.display = "block";
    fallbackLink.style.textAlign = "center";
  }

  // Compose dynamic WhatsApp message template
  const whatsappMessage = `🛕 Ayilara Temple Booking

Name: ${name}
Address: ${address}
Amount: ₹${total}
${donateOnly ? "Type: Donation Only" : `Pooja: ${poojaText}\nNakshatra: ${nakshatraText}\nDate: ${date}`}

🙏 Payment completed. Please review and confirm booking.`;

  const whatsappBtn = document.getElementById("whatsappBtn");
  if (whatsappBtn) {
    whatsappBtn.onclick = () => {
      window.open(`https://wa.me/${templePhone}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
    };
  }

  // Clear modal and reset inputs
  const formElement = document.getElementById("bookingForm");
  if (formElement) formElement.reset();
  
  updateSummary();
  closeBooking();
}

/**
 * ==========================================================================
 * 10. MULTILINGUAL LANGUAGE TOGGLE
 * ==========================================================================
 */
function toggleLang() {
  currentLanguage = (currentLanguage === 'en') ? 'ml' : 'en';

  const isEn = (currentLanguage === 'en');

  // Toggle Visibility Classes for Special Poojas
  document.querySelectorAll('.lang-en').forEach(el => {
    el.classList.remove('lang-show', 'lang-hide');
    el.classList.add(isEn ? 'lang-show' : 'lang-hide');
  });

  document.querySelectorAll('.lang-ml').forEach(el => {
    el.classList.remove('lang-show', 'lang-hide');
    el.classList.add(isEn ? 'lang-hide' : 'lang-show');
  });

  // Translation Dictionaries
  document.getElementById("templeTitle").innerHTML = isEn
    ? '🛕 Ayilara Madathil Sree Bhadra Bhagavathi Temple<br><span>അയിലറ മഠത്തിൽ ശ്രീ ഭദ്രാ ഭഗവതി ക്ഷേത്രം</span>'
    : '🛕 അയിലറ മഠത്തിൽ ശ്രീ ഭദ്രാ ഭഗവതി ക്ഷേത്രം<br><span>Ayilara Madathil Sree Bhadra Bhagavathi Temple</span>';

  document.getElementById("navAbout").innerText = isEn ? "About" : "ക്ഷേത്രത്തെക്കുറിച്ച്";
  document.getElementById("navSpecialRituals").innerText = isEn ? "Notice" : "അറിയിപ്പ്";
  document.getElementById("navGallery").innerText = isEn ? "Gallery" : "ഗാലറി";
  document.getElementById("navLocation").innerText = isEn ? "Location" : "സ്ഥലം";
  document.getElementById("navDonate").innerText = isEn ? "Donation" : "സംഭാവന";
  document.getElementById("navBook").innerText = isEn ? "Pooja Booking" : "പൂജ ബുക്കിംഗ്";
  document.getElementById("langBtn").innerText = isEn ? "മലയാളം" : "English";

  document.getElementById("heroTitle").innerText = isEn
    ? "A divine abode of faith and grace, where devotees seek protection, prosperity, and spiritual peace."
    : "വിശ്വാസത്തിന്റെയും ദൈവികമായ കൃപയുടെയും അഭയസ്ഥാനം, ഭക്തർ സുരക്ഷ, സമൃദ്ധി, ആത്മീയം പ്രാപിക്കുന്നു.";

  document.getElementById("aboutTitle").innerText = isEn ? "🛕About the Temple🛕" : "🛕ക്ഷേത്രത്തെക്കുറിച്ച്🛕";
  document.getElementById("aboutText").innerText = isEn
    ? "The ancient and famous temple, named after its five chambers, is a sacred place where the eight-fold blessings of the goddess Ailara are bestowed on the forehead like sandalwood powder, the bestower of blessings on the lips, and the meritorious deity of many thousands, Sri Bhadra Bhagavati, who shines with the virtue of seeing, is equally important, Sri Maha Vishnu, the destroyer of all obstacles, Sri Maha Ganapathi, and other sub-deities shower blessings on the devotees. Annual Notice and poojas bring the community together in devotion, making it a place of faith, peace, and divine grace."
    : "അതിപുരാതനവും ക്ഷേത്രപ്രസിദ്ധവും അഞ്ച് അറകളാൽ നാമകരണം ചെയ്തിട്ടുള്ള അയിലറയുടെ തിരുനെറ്റിയിൽ ചന്ദനപൊട്ടുപോലെ അഷ്ട ഐശ്വര്യ പ്രദായിനിയും വിളിപ്പുറത്തു അനുഗ്രഹദായികയും അനേകായിരങ്ങൾക്ക് ദർശന പുണ്യവുമായി പ്രശോഭിക്കുന്ന ശ്രീ ഭദ്രാ ഭഗവതിയും തുല്യ പ്രാധാന്യത്തിൽ വാണരുളുന്ന ശ്രീ മഹാവിഷ്ണുവും സർവ്വവിഘ്ന വിനാശകനായ ശ്രീ മഹാ ഗണപതിയും മറ്റു ഉപദേവി ദേവന്മാരും സജ്ജനങ്ങൾക്ക് അനുഗ്രഹ ആശിസുകൾ ചൊരിയുന്ന ഒരു പുണ്യകേന്ദ്രമാണ്. വർഷാന്ത്യ ഉത്സവങ്ങളും പൂജകളും സമൂഹത്തെ ഭക്തിയിൽ ഒന്നിപ്പിക്കുന്നു.";

  document.getElementById("special-ritualsTitle").innerText = isEn ? "🛕 Notice 🛕" : "🛕അറിയിപ്പ് 🛕";
  document.getElementById("special-ritualsText").innerText = isEn
    ? "Devotees are hereby respectfully informed, in the name of the Goddess, that contributions are being invited for the purchase of property for the Ayilara Madathil Sree Bhadra Bhagavathi Temple. All devotees are requested to participate in this sacred endeavor by making generous donations according to their capacity. The wholehearted support and cooperation of all devotees are earnestly sought for the successful completion of this noble cause. – Temple Committee"
    : "അയിലറ മഠത്തിൽ ശ്രീ ഭദ്ര ഭഗവതി ക്ഷേത്രത്തിലേക്ക് വാസ്തു വാങ്ങുന്നതിനായുള്ള പുണ്യകർമത്തിൽ, ഭക്തജനങ്ങൾ തങ്ങളുടെ ശേഷിയനുസരിച്ച് ഉദാരമായ സംഭാവനകൾ നൽകി പങ്കാളികളാകണമെന്നു ദേവി നാമത്തിൽ ഭക്ത്യാദരപൂർവ്വം അഭ്യർത്ഥിക്കുന്നു. ഈ ധർമ്മ പ്രവർത്തനത്തിൽ എല്ലാ ഭക്തജനങ്ങളുടെയും സഹകരണവും സാന്നിധ്യവും അഭിലഷിക്കുന്നു. – ക്ഷേത്ര കമ്മിറ്റി.";

  document.getElementById("galleryTitle").innerText = isEn ? "Gallery" : "ഗാലറി";
  document.getElementById("locationTitle").innerText = isEn ? "Location" : "സ്ഥലം";
  document.getElementById("donationTitle").innerText = isEn ? "Bank & UPI Donation" : "ബാങ്ക് & UPI സംഭാവന";
  document.getElementById("timingsTitle").innerText = isEn ? "🛕 Daily Pooja Timings 🛕" : "🛕ദൈനംദിന പൂജ സമയങ്ങൾ🛕";

  document.getElementById("timingsText").innerHTML = isEn
    ? `
      <p>🕔 <b>5:45 AM</b> <span>Nada Thurakkal</span></p>
      <p>🔥 <b>6:15 AM</b> <span>Ganapathi Homam</span></p>
      <p>🌼 <b>7:00 AM</b> <span>Morning Pooja</span></p>
      <p>🌞 <b>9:30 AM</b> <span>Ucha Pooja</span></p>
      <p>🔔 <b>5:00 PM</b> <span>Temple Reopens</span></p>
      <p>🪔 <b>6:30 PM</b> <span>Deeparadhana</span></p>
      <p>🌙 <b>7:30 PM</b> <span>Athazha Pooja</span></p>
      <p>🚪 <b>8:00 PM</b> <span>Nada Adakkal</span></p>
    `
    : `
      <p>🕔 <b>5:45 AM</b> <span>നട തുറക്കൽ</span></p>
      <p>🔥 <b>6:15 AM</b> <span>ഗണപതി ഹോമം</span></p>
      <p>🌼 <b>7:00 AM</b> <span>പ്രഭാത പൂജ</span></p>
      <p>🌞 <b>9:30 AM</b> <span>ഉച്ച പൂജ</span></p>
      <p>🔔 <b>5:00 PM</b> <span>ക്ഷേത്രം തുറക്കും</span></p>
      <p>🪔 <b>6:30 PM</b> <span>ദീപാരാധന</span></p>
      <p>🌙 <b>7:30 PM</b> <span>അത്താഴ പൂജ</span></p>
      <p>🚪 <b>8:00 PM</b> <span>നട അടയ്ക്കൽ</span></p>
    `;

  const popupTitle = document.getElementById("popupTitle");
  if (popupTitle) {
    popupTitle.innerText = isEn ? "Donation / Pooja Booking" : "സംഭാവന / പൂജ ബുക്കിംഗ്";
  }

  const floatingTrigger = document.querySelector(".floating");
  if (floatingTrigger) {
    floatingTrigger.innerText = isEn ? "🛕 Book Pooja / Donation" : "🛕 പൂജ ബുക്കിംഗ് / സംഭാവന";
  }

  // Update dates or placeholder text if needed
  updateSummary();
}

/**
 * ==========================================================================
 * 11. TOP SCROLL BUTTON ACTIONS
 * ==========================================================================
 */
window.onscroll = () => {
  const topBtn = document.getElementById("topBtn");
  if (topBtn) {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
      topBtn.style.display = "flex";
    } else {
      topBtn.style.display = "none";
    }
  }
};

const topBtn = document.getElementById("topBtn");
if (topBtn) {
  topBtn.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}

// Global hooks for dynamic clicks defined as onlicks in HTML
window.openBooking = openBooking;
window.closeBooking = closeBooking;
window.closeSuccess = closeSuccess;
window.togglePooja = togglePooja;
window.toggleLang = toggleLang;
window.closeLightbox = closeLightbox;
window.navigateLightbox = navigateLightbox;
