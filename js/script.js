document.addEventListener('DOMContentLoaded', function() {
    // 1. Menu Hamburger (Toggle Navigation)
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');
    const navList = document.querySelector('.nav-list');

    // Verifica se os elementos existem antes de adicionar event listeners
    if (hamburgerBtn && mainNav && navList) {
        hamburgerBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            hamburgerBtn.classList.toggle('active'); // Para animação do ícone (X)
        });

        // Fechar menu ao clicar em um item (apenas para mobile)
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Usa o mesmo breakpoint do CSS para consistência (767px ou 768px)
                if (window.innerWidth <= 768) {
                    mainNav.classList.remove('active');
                    hamburgerBtn.classList.remove('active');
                }
            });
        });
    }

    // 2. Animação de Rolagem Suave (Smooth Scrolling)
    // Seleciona todos os links que começam com '#' (âncoras)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Impede o comportamento padrão de salto

            const targetId = this.getAttribute('href'); // Obtém o ID do alvo (ex: "#services")
            const targetElement = document.querySelector(targetId); // Encontra o elemento alvo no DOM

            if (targetElement) { // Verifica se o elemento alvo existe
                const header = document.querySelector('.main-header');
                // Calcula a altura do cabeçalho se ele for sticky para ajustar o scroll
                const headerOffset = header ? header.offsetHeight : 0;
                
                // Posição do elemento alvo em relação ao viewport, mais a rolagem atual, menos o offset do cabeçalho
                const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth" // Adiciona a rolagem suave
                });
            }
        });
    });

    // 3. Botão "Voltar ao Topo"
    const backToTopBtn = document.getElementById('backToTopBtn');

    if (backToTopBtn) { // Verifica se o botão existe
        window.addEventListener('scroll', function() {
            // Mostra o botão quando o usuário rola para baixo 300px
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
                // Adiciona uma pequena transição para aparecer suavemente
                backToTopBtn.style.opacity = '1';
            } else {
                // Inicia a transição para desaparecer
                backToTopBtn.style.opacity = '0';
                // Esconde o botão completamente após a transição (0.3s definido no CSS)
                setTimeout(() => {
                    backToTopBtn.style.display = 'none';
                }, 300);
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: "smooth" // Rolagem suave de volta ao topo
            });
        });
    }

    // 4. Validação Básica de Formulário de Contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) { // Verifica se o formulário existe na página
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Impede o envio padrão do formulário (que recarregaria a página)

            // Coleta os valores dos campos e remove espaços em branco extras
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validação de campos vazios
            if (name === '' || email === '' || message === '') {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return; // Interrompe a função se houver campos vazios
            }

            // Validação de formato de e-mail
            if (!validateEmail(email)) {
                alert('Por favor, insira um endereço de e-mail válido.');
                return; // Interrompe a função se o e-mail for inválido
            }

            // Para fins de demonstração ou prototipagem, podemos simplesmente exibir uma mensagem de sucesso:
            alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');
            contactForm.reset(); // Limpa o formulário após o "envio"
        });
    }

    // Função auxiliar para validar formato de e-mail
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // 5. Animação de elementos ao scroll (Intersection Observer API)
    // Seleciona todos os elementos que devem ter animação ao entrar na tela
    const animateOnScrollElements = document.querySelectorAll(
        '.service-card, .feature-item, .about-content, .contact-info-form-wrapper, .solution-card, .what-we-do, .services-detail-img, .stats-grid'
    );

    // Opções para o Intersection Observer
    const observerOptions = {
        root: null, // O viewport como o elemento raiz
        rootMargin: '0px', // Margem extra para o root (pode ser usado para carregar antes de realmente entrar)
        threshold: 0.1 // Quando 10% do elemento estiver visível, a callback é disparada
    };

    // Cria uma nova instância do Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { // Se o elemento está visível na viewport
                entry.target.classList.add('fade-in-up'); // Adiciona a classe que dispara a animação CSS
                observer.unobserve(entry.target); // Para de observar o elemento para animar apenas uma vez
            }
        });
    }, observerOptions);

    // Adiciona a classe inicial 'animate-on-scroll' a todos os elementos e os observa
    animateOnScrollElements.forEach(el => {
        el.classList.add('animate-on-scroll'); // Esta classe define o estado inicial (invisível/deslocado)
        observer.observe(el); // Começa a observar cada elemento
    });
});