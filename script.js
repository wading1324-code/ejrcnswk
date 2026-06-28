// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDarkMode = body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
  themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
  updateCharts();
});

// Check for saved theme preference or default to light mode
const savedDarkMode = localStorage.getItem('darkMode') === 'true';
if (savedDarkMode) {
  body.classList.add('dark-mode');
  themeToggle.textContent = '☀️';
}

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Chart Data
const isDarkMode = () => body.classList.contains('dark-mode');
const chartTextColor = () => isDarkMode() ? '#FFFFFF' : '#333333';
const chartGridColor = () => isDarkMode() ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

// Cost Distribution Chart (Pie Chart)
function createCostChart() {
  const ctx = document.getElementById('costChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['아크릴 키링', '띠부씰', '아크릴 코롯토', '칼선스티커', '엽서', 'OPP 봉투'],
      datasets: [{
        data: [42.9, 25.9, 22.5, 5.4, 3.0, 0.2],
        backgroundColor: [
          '#FF6B6B',
          '#FFE66D',
          '#4ECDC4',
          '#95E1D3',
          '#C7CEEA',
          '#D4A5A5'
        ],
        borderColor: isDarkMode() ? '#2D2D2D' : '#FFFFFF',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: chartTextColor(),
            font: { size: 13, weight: '500' },
            padding: 15,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.label + ': ' + context.parsed + '%';
            }
          },
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleColor: '#FFFFFF',
          bodyColor: '#FFFFFF',
          padding: 12,
          borderRadius: 6
        }
      }
    }
  });
}

// Margin Comparison Chart (Bar Chart)
function createMarginChart() {
  const ctx = document.getElementById('marginChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['띠부씰', '엽서', '아크릴 키링', '칼선스티커', '아크릴 코롯토'],
      datasets: [{
        label: '마진율 (%)',
        data: [79.0, 74.4, 70.2, 67.7, 59.0],
        backgroundColor: [
          'rgba(255, 215, 0, 0.8)',
          'rgba(255, 107, 107, 0.8)',
          'rgba(78, 205, 196, 0.8)',
          'rgba(149, 225, 211, 0.8)',
          'rgba(199, 206, 234, 0.8)'
        ],
        borderColor: [
          '#FFD700',
          '#FF6B6B',
          '#4ECDC4',
          '#95E1D3',
          '#C7CEEA'
        ],
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: [
          'rgba(255, 215, 0, 1)',
          'rgba(255, 107, 107, 1)',
          'rgba(78, 205, 196, 1)',
          'rgba(149, 225, 211, 1)',
          'rgba(199, 206, 234, 1)'
        ]
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          ticks: {
            color: chartTextColor(),
            font: { size: 12 },
            callback: function(value) {
              return value + '%';
            }
          },
          grid: {
            color: chartGridColor()
          }
        },
        y: {
          ticks: {
            color: chartTextColor(),
            font: { size: 13, weight: '500' }
          },
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: chartTextColor(),
            font: { size: 13, weight: '500' },
            padding: 15
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleColor: '#FFFFFF',
          bodyColor: '#FFFFFF',
          padding: 12,
          borderRadius: 6,
          callbacks: {
            label: function(context) {
              return '마진율: ' + context.parsed.x + '%';
            }
          }
        }
      }
    }
  });
}

// Update charts when theme changes
function updateCharts() {
  // Destroy existing charts
  Chart.helpers.each(Chart.instances, function(instance) {
    instance.destroy();
  });
  
  // Recreate charts
  setTimeout(() => {
    createCostChart();
    createMarginChart();
  }, 100);
}

// Initialize charts on page load
document.addEventListener('DOMContentLoaded', () => {
  createCostChart();
  createMarginChart();
});

// Add animation to elements on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'slideInUp 0.6s ease-out';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.kpi-card, .spec-card, .note-card, .ranking-item, .scenario-card').forEach(el => {
  observer.observe(el);
});

// Number formatter for currency
function formatCurrency(num) {
  return '₩' + num.toLocaleString('ko-KR');
}

// Hover effects for interactive elements
document.querySelectorAll('.scenario-card, .ranking-item, .kpi-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transition = 'all 0.3s ease';
  });
});

// Add scroll indicator for sticky navbar
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 100) {
    navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  } else {
    navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
  }
});

console.log('📊 Financial Report Dashboard Loaded Successfully!');
console.log('🌙 Press theme toggle to switch between light and dark mode');
console.log('📱 Fully responsive design for all devices');
