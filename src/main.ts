import './styles.css';

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  }
}, observerOptions);

// Observe all timeline items
document.addEventListener('DOMContentLoaded', () => {
  const timelineItems = document.querySelectorAll('.timeline-item');
  for (const item of timelineItems) {
    observer.observe(item);
  }

  // Smooth scroll for scroll indicator
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const timelineSection = document.querySelector('.timeline-section');
      if (timelineSection) {
        timelineSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Add parallax effect to hero section
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero') as HTMLElement;
    if (hero && scrolled < window.innerHeight) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });

  // Add stagger animation to timeline items on load
  setTimeout(() => {
    let index = 0;
    for (const item of timelineItems) {
      setTimeout(() => {
        item.classList.add('fade-in');
      }, index * 100);
      index++;
    }
  }, 500);
});

// Add typing effect to hero title
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  const text = heroTitle.textContent || '';
  heroTitle.textContent = '';
  let i = 0;

  const typeWriter = () => {
    if (i < text.length) {
      heroTitle.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    }
  };

  setTimeout(typeWriter, 500);
}

// Gallery Modal Functionality
let currentImageIndex = 0;
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('galleryModal');
const modalImage = document.querySelector('.modal-image') as HTMLImageElement;
const modalTitle = document.querySelector('.modal-title');
const modalDescription = document.querySelector('.modal-description');
const closeBtn = document.querySelector('.modal-close');
const prevBtn = document.querySelector('.modal-prev');
const nextBtn = document.querySelector('.modal-next');

// Open modal when gallery item is clicked
for (const [index, item] of Array.from(galleryItems).entries()) {
  item.addEventListener('click', () => {
    currentImageIndex = index;
    openModal(index);
  });
}

function openModal(index: number) {
  const item = galleryItems[index] as HTMLElement;
  const img = item.querySelector('img') as HTMLImageElement;
  const title = item.getAttribute('data-title') || '';
  const description = item.getAttribute('data-description') || '';

  if (modalImage && modalTitle && modalDescription && modal) {
    modalImage.src = img.src;
    modalImage.alt = img.alt;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function showPrevImage() {
  currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
  openModal(currentImageIndex);
}

function showNextImage() {
  currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
  openModal(currentImageIndex);
}

// Event listeners for modal controls
if (closeBtn) {
  closeBtn.addEventListener('click', closeModal);
}

if (prevBtn) {
  prevBtn.addEventListener('click', showPrevImage);
}

if (nextBtn) {
  nextBtn.addEventListener('click', showNextImage);
}

// Close modal when clicking outside the image
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!modal?.classList.contains('active')) return;

  if (e.key === 'Escape') {
    closeModal();
  } else if (e.key === 'ArrowLeft') {
    showPrevImage();
  } else if (e.key === 'ArrowRight') {
    showNextImage();
  }
});