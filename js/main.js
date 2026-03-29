// ==================== 粒子拖尾效果 ====================
class ParticleTrail {
    constructor() {
        this.particles = [];
        this.particleContainer = null;
        this.lastX = 0;
        this.lastY = 0;
        this.hue = 0;
        this.isMobile = window.innerWidth <= 768;

        this.init();
    }

    init() {
        // 移动端不启用粒子效果
        if (this.isMobile) return;

        // 创建粒子容器
        this.particleContainer = document.createElement('div');
        this.particleContainer.className = 'cursor-particles';
        document.body.appendChild(this.particleContainer);

        // 监听鼠标移动
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('touchmove', this.handleTouchMove.bind(this));

        // 动画循环
        this.animate();
    }

    handleMouseMove(e) {
        if (this.isMobile) return;

        const x = e.clientX;
        const y = e.clientY;

        // 计算移动距离，避免产生过多粒子
        const distance = Math.hypot(x - this.lastX, y - this.lastY);

        if (distance > 5) {
            this.createParticle(x, y);
            this.lastX = x;
            this.lastY = y;
        }
    }

    handleTouchMove(e) {
        if (this.isMobile) return;

        const touch = e.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;

        const distance = Math.hypot(x - this.lastX, y - this.lastY);

        if (distance > 8) {
            this.createParticle(x, y, true);
            this.lastX = x;
            this.lastY = y;
        }
    }

    createParticle(x, y, isTouch = false) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // 冰淇淋色调颜色
        const colors = [
            'rgba(252, 215, 252, 0.8)',   // 淡粉色
            'rgba(177, 235, 252, 0.8)',   // 天蓝色
            'rgba(208, 255, 201, 0.8)',   // 薄荷绿
            'rgba(222, 252, 242, 0.8)'    // 淡紫粉色
        ];

        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const size = isTouch ? Math.random() * 8 + 6 : Math.random() * 6 + 4;

        particle.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: ${randomColor};
            box-shadow: 0 0 ${size * 2}px ${randomColor};
        `;

        this.particleContainer.appendChild(particle);
        this.particles.push({
            element: particle,
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1
        });

        // 限制粒子数量
        if (this.particles.length > 50) {
            const oldParticle = this.particles.shift();
            oldParticle.element.remove();
        }
    }

    animate() {
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.02;

            particle.element.style.left = `${particle.x}px`;
            particle.element.style.top = `${particle.y}px`;
            particle.element.style.opacity = particle.life;

            if (particle.life <= 0) {
                particle.element.remove();
                this.particles.splice(index, 1);
            }
        });

        requestAnimationFrame(this.animate.bind(this));
    }
}

// 初始化粒子效果
const particleTrail = new ParticleTrail();

// ==================== 导航栏交互 ====================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// 点击导航链接后关闭菜单
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ==================== 滚动时导航栏效果 ====================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }

    lastScroll = currentScroll;
});

// ==================== 滚动动画 ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// 为各个section添加动画效果
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// ==================== 打字效果 ====================
// 根据页面语言使用不同文本
const isEnglishPage = window.location.pathname.includes('index_en.html');
const typingTexts = isEnglishPage ? [
    'Backend Developer | Java/Go | AI Applications | Enterprise Systems',
    'Lark Knowledge Q&A | WeBank | Meituan',
    'RAG Architecture | Distributed Systems | Performance Optimization'
] : [
    '多年服务端开发经验 | Java/Go | AI应用 | 企业级系统',
    '飞书知识问答 | 微众银行 | 美团点评',
    'RAG架构 | 分布式系统 | 性能优化'
];

let textIndex = 0;
let charIndex = 0;
const typingElement = document.querySelector('.typing-text');
const typedLines = [];

function typeEffect() {
    // 如果所有行都打完了，停止
    if (textIndex >= typingTexts.length) {
        return;
    }

    const currentText = typingTexts[textIndex];

    if (charIndex < currentText.length) {
        // 正在打字
        typedLines[textIndex] = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingElement.innerHTML = typedLines.filter(line => line !== undefined).join('<br>');
        setTimeout(typeEffect, 80);
    } else {
        // 当前行打完，停顿后开始下一行
        textIndex++;
        charIndex = 0;
        setTimeout(typeEffect, 1500);
    }
}

// 延迟启动打字效果
setTimeout(typeEffect, 1000);

// ==================== 技能标签悬停效果 ====================
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.background = 'linear-gradient(135deg, #F472B6, #818CF8)';
    });

    tag.addEventListener('mouseleave', function() {
        this.style.background = 'linear-gradient(135deg, #FCD7FC, #B1EBFC)';
    });
});

// ==================== 平滑滚动 ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 60;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== 视差滚动效果 ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.05;
        shape.style.transform = `translate(-50%, -50%) translateY(${scrolled * speed}px)`;
    });
});

// ==================== 当前活跃导航链接高亮 ====================
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', highlightNav);

// ==================== 数字计数动画 ====================
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}

// ==================== 鼠标跟随效果 ====================
const hero = document.querySelector('.hero');

hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const xPercent = (clientX / innerWidth - 0.5) * 2;
    const yPercent = (clientY / innerHeight - 0.5) * 2;

    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const depth = (index + 1) * 10;
        shape.style.transform = `translate(-50%, -50%) translate(${xPercent * depth}px, ${yPercent * depth}px)`;
    });
});

// ==================== 页面加载动画 ====================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ==================== 控制台彩蛋 - 冰淇淋色调 ====================
if (isEnglishPage) {
    console.log('%cWelcome to my personal website!', 'font-size: 20px; color: #FCD7FC; font-weight: bold;');
    console.log('%cIf you\'re interested in my work, feel free to reach out!', 'font-size: 14px; color: #B1EBFC;');
    console.log('%c🍦 Let\'s build something amazing together!', 'font-size: 12px; color: #D0FFC9;');
} else {
    console.log('%c欢迎来到我的个人网站！', 'font-size: 20px; color: #FCD7FC; font-weight: bold;');
    console.log('%c如果你对代码感兴趣，欢迎联系我！', 'font-size: 14px; color: #B1EBFC;');
    console.log('%c🍦 Let\'s build something amazing together!', 'font-size: 12px; color: #D0FFC9;');
}

// ==================== 返回顶部按钮 ====================
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.innerHTML = '↑';
backToTop.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FCD7FC, #B1EBFC);
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 4px 15px rgba(244, 114, 182, 0.4);
`;

document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        backToTop.style.opacity = '1';
        backToTop.style.visibility = 'visible';
    } else {
        backToTop.style.opacity = '0';
        backToTop.style.visibility = 'hidden';
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

backToTop.addEventListener('mouseenter', () => {
    backToTop.style.transform = 'scale(1.1)';
});

backToTop.addEventListener('mouseleave', () => {
    backToTop.style.transform = 'scale(1)';
});

// ==================== 懒加载图片（预留功能） ====================
// 如果后续添加真实图片，可以使用懒加载
/*
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('img.lazy').forEach(img => {
    imageObserver.observe(img);
});
*/

console.log(isEnglishPage ? '✨ All interactive effects loaded! Particle trail enabled.' : '✨ 所有交互效果已加载完成！粒子拖尾效果已启用。');

// ==================== 职业感悟折叠功能 ====================
function toggleInsights() {
    const section = document.querySelector('#insights-section');
    section.classList.toggle('expanded');
}

// 默认隐藏职业感悟板块
document.addEventListener('DOMContentLoaded', function() {
    const insightsSection = document.querySelector('#insights-section');
    if (insightsSection) {
        insightsSection.classList.remove('expanded');
    }
});
