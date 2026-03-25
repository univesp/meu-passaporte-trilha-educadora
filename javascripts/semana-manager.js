// Classe principal para gerenciar as casas da semana
class SemanaManager {
  constructor(config) {
    this.semanaId = config.semanaId || 1;
    this.totalCasas = config.totalCasas || 6;
    this.casaAtual = 1;
    this.casas = {};
    this.bullets = [];
    this.navTabs = [];
    this.onCasaChange = config.onCasaChange || null;
    this.storageKey = `semana${this.semanaId}Dados`;
    
    this.init();
  }
  
  init() {
    this.carregarCasas();
    this.criarBullets();
    this.configurarNavTabs();
    this.configurarNavegacao();
    
    // Verifica se a semana já foi concluída
    if (!this.verificarSemanaConcluida()) {
      this.mudarCasa(this.casaAtual);
      this.carregarDadosSalvos();
    }
  }
  
  // Verifica se a semana está concluída e ajusta a interface
  verificarSemanaConcluida() {
    if (this.isSemanaConcluida()) {
      // Esconde bullets e nav-tabs
      const bulletsContainer = document.querySelector('.bullets');
      const navTabsContainer = document.querySelector('.nav-tabs');
      
      if (bulletsContainer) bulletsContainer.style.display = 'none';
      if (navTabsContainer) navTabsContainer.style.display = 'none';
      
      // Esconde todas as casas exceto a 6
      for (let i = 1; i <= this.totalCasas; i++) {
        if (this.casas[i] && i !== 6) {
          if (this.casas[i].conteudo) this.casas[i].conteudo.style.display = 'none';
          if (this.casas[i].bottom) this.casas[i].bottom.style.display = 'none';
          if (this.casas[i].header) this.casas[i].header.style.display = 'none';
        }
      }
      
      // Mostra apenas a casa 6
      if (this.casas[6]) {
        if (this.casas[6].conteudo) this.casas[6].conteudo.style.display = 'block';
        if (this.casas[6].bottom) {
          this.casas[6].bottom.style.display = 'flex';
          this.casas[6].bottom.style.justifyContent = 'center';
          this.casas[6].bottom.style.gap = '20px';
          this.casas[6].bottom.style.flexWrap = 'wrap';
        }
        if (this.casas[6].header) this.casas[6].header.style.display = 'block';
      }
      
      this.casaAtual = 6;
      return true;
    }
    return false;
  }
  
  // Reiniciar a trilha (limpa dados e recarrega)
  reiniciarTrilha() {
    localStorage.removeItem(this.storageKey);
    window.location.reload();

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      });
    }, 0);
  }
  
  // Obtém todos os dados salvos
  getDadosSalvos() {
    const dados = localStorage.getItem(this.storageKey);
    return dados ? JSON.parse(dados) : {
      semanaConcluida: false,
      casas: {
        2: {},
        3: {},
        4: {},
        5: {}
      }
    };
  }
  
  // Salva todos os dados de uma vez
  salvarTodosDados() {
    const dadosCompletos = this.getDadosSalvos();
    
    for (let i = 2; i <= 5; i++) {
      const dadosCasa = this.coletarDadosCasa(i);
      if (dadosCasa && Object.keys(dadosCasa).length > 0) {
        dadosCompletos.casas[i] = dadosCasa;
      }
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(dadosCompletos));
  }
  
  // Marca a semana como concluída
  marcarSemanaConcluida() {
    const dados = this.getDadosSalvos();
    dados.semanaConcluida = true;
    localStorage.setItem(this.storageKey, JSON.stringify(dados));
  }
  
  // Verifica se a semana foi concluída
  isSemanaConcluida() {
    const dados = this.getDadosSalvos();
    return dados.semanaConcluida || false;
  }
  
  carregarCasas() {
    for (let i = 1; i <= this.totalCasas; i++) {
      const casaElement = document.querySelector(`.conteudo-casa-${i}`);
      const bottomElement = document.querySelector(`.bottom-action.conteudo-casa-${i}`);
      const headerElement = document.querySelector(`.header-titles[data-casa="${i}"]`);
      
      if (casaElement) {
        this.casas[i] = {
          conteudo: casaElement,
          bottom: bottomElement,
          header: headerElement
        };
        
        if (casaElement) casaElement.style.display = 'none';
        if (bottomElement) bottomElement.style.display = 'none';
        if (headerElement) headerElement.style.display = 'none';
      }
    }
  }
  
  criarBullets() {
    const bulletsContainer = document.querySelector('.bullets');
    if (!bulletsContainer) return;
    
    bulletsContainer.innerHTML = '';
    
    for (let i = 1; i <= this.totalCasas; i++) {
      const bullet = document.createElement('div');
      bullet.className = 'bullet-item';
      bullet.setAttribute('data-casa', i);
      
      if (i === this.totalCasas) {
        bullet.style.cursor = 'not-allowed';
        bullet.style.opacity = '0.5';
        bullet.addEventListener('click', (e) => {
          e.preventDefault();
        });
      } else {
        bullet.addEventListener('click', () => this.mudarCasa(i));
      }
      
      bulletsContainer.appendChild(bullet);
      this.bullets.push(bullet);
    }
  }
  
  configurarNavTabs() {
    const navTabsContainer = document.querySelector('.nav-tabs');
    if (!navTabsContainer) return;
    
    const tabs = navTabsContainer.querySelectorAll('.nav-tab');
    tabs.forEach((tab, index) => {
      const casaNumero = index + 1;
      tab.setAttribute('data-casa', casaNumero);
      
      const newTab = tab.cloneNode(true);
      tab.parentNode.replaceChild(newTab, tab);
      
      newTab.addEventListener('click', () => {
        if (casaNumero <= this.totalCasas - 1) {
          this.mudarCasa(casaNumero);
        }
      });
      this.navTabs.push(newTab);
    });
  }
  
  configurarNavegacao() {
    for (let i = 1; i <= this.totalCasas; i++) {
      const bottomAction = document.querySelector(`.bottom-action.conteudo-casa-${i}`);
      if (!bottomAction) continue;
      
      const buttons = bottomAction.querySelectorAll('button');
      if (buttons.length === 0) continue;
      
      const voltarBtn = buttons[0];
      const continuarBtn = buttons[1];
      
      if (voltarBtn) {
        if (i > 1) {
          const newVoltarBtn = voltarBtn.cloneNode(true);
          voltarBtn.parentNode.replaceChild(newVoltarBtn, voltarBtn);
          newVoltarBtn.addEventListener('click', () => this.mudarCasa(i - 1));
          newVoltarBtn.style.display = 'inline-block';
        } else {
          voltarBtn.style.display = 'none';
        }
      }
      
      if (continuarBtn) {
        if (i < this.totalCasas && i !== 5) {
          const newContinuarBtn = continuarBtn.cloneNode(true);
          continuarBtn.parentNode.replaceChild(newContinuarBtn, continuarBtn);
          newContinuarBtn.addEventListener('click', () => {
            this.salvarTodosDados();
            this.mudarCasa(i + 1);
          });
        } else if (i === 5) {
          const newContinuarBtn = continuarBtn.cloneNode(true);
          continuarBtn.parentNode.replaceChild(newContinuarBtn, continuarBtn);
        }
      }
    }
  }
  
  mudarCasa(numeroCasa) {
    if (numeroCasa < 1 || numeroCasa > this.totalCasas) return;
     
    if (this.casaAtual) {
      this.salvarTodosDados();
    }
    
    if (this.casas[this.casaAtual]) {
      if (this.casas[this.casaAtual].conteudo) 
        this.casas[this.casaAtual].conteudo.style.display = 'none';
      if (this.casas[this.casaAtual].bottom) 
        this.casas[this.casaAtual].bottom.style.display = 'none';
      if (this.casas[this.casaAtual].header) 
        this.casas[this.casaAtual].header.style.display = 'none';
    }
    
    if (this.bullets[this.casaAtual - 1]) {
      this.bullets[this.casaAtual - 1].classList.remove('bullet-ativo');
    }
    
    if (this.navTabs[this.casaAtual - 1]) {
      this.navTabs[this.casaAtual - 1].classList.remove('active-pill');
    }
    
    this.casaAtual = numeroCasa;
    
    if (this.casas[this.casaAtual]) {
      if (this.casas[this.casaAtual].conteudo) 
        this.casas[this.casaAtual].conteudo.style.display = 'block';
      if (this.casas[this.casaAtual].bottom) {
        this.casas[this.casaAtual].bottom.style.display = 'flex';
        this.casas[this.casaAtual].bottom.style.justifyContent = 'center';
        this.casas[this.casaAtual].bottom.style.gap = '20px';
        this.casas[this.casaAtual].bottom.style.flexWrap = 'wrap';
      }
      if (this.casas[this.casaAtual].header) 
        this.casas[this.casaAtual].header.style.display = 'block';
    }
    
    const bulletsContainer = document.querySelector('.bullets');
    const navTabsContainer = document.querySelector('.nav-tabs');
    
    if (bulletsContainer) bulletsContainer.style.display = 'flex';
    if (navTabsContainer) navTabsContainer.style.display = 'flex';
    
    if (this.bullets[this.casaAtual - 1]) {
      this.bullets[this.casaAtual - 1].classList.add('bullet-ativo');
    }
    
    if (this.casaAtual <= 5 && this.navTabs[this.casaAtual - 1]) {
      this.navTabs[this.casaAtual - 1].classList.add('active-pill');
    }
    
    this.carregarDadosCasa(this.casaAtual);

    // Scrolla para o topo
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    if (this.onCasaChange) {
      this.onCasaChange(this.casaAtual);
    }
  }
  
  salvarDadosCasa(casaNumero) {
    this.salvarTodosDados();
  }
  
  coletarDadosCasa(casaNumero) {
    switch(casaNumero) {
      case 2:
        return this.coletarDadosPassaporte();
      case 3:
        return this.coletarDadosAtividade();
      case 4:
        return this.coletarDadosAprendizado();
      case 5:
        return this.coletarDadosAplicacao();
      default:
        return null;
    }
  }
  
  coletarDadosPassaporte() {
    const estudanteNome = document.getElementById('estudanteNome')?.value || '';
    const espacoVisitado = document.getElementById('espacoVisitado')?.value || '';
    const modalidadeSelecao = document.getElementById('modalidadeSelecao')?.value || '';
    const checkinData = document.getElementById('checkinData')?.value || '';
    const localDescricao = document.getElementById('localDescricao')?.value || '';
    const imagePreview = document.getElementById('imagePreview');
    
    let fotoBase64 = '';
    if (imagePreview && imagePreview.style.display === 'block' && imagePreview.src && imagePreview.src.startsWith('data:image')) {
      fotoBase64 = imagePreview.src;
    }
    
    return {
      estudanteNome,
      espacoVisitado,
      modalidadeSelecao,
      checkinData,
      localDescricao,
      fotoBase64
    };
  }
  
  coletarDadosAtividade() {
    const experiencia1 = document.getElementById('experiencia1Descricao')?.value || '';
    const experiencia2 = document.getElementById('experiencia2Descricao')?.value || '';
    const experiencia3 = document.getElementById('experiencia3Descricao')?.value || '';
    
    return {
      experiencia1,
      experiencia2,
      experiencia3
    };
  }
  
  coletarDadosAprendizado() {
    const reflexao = document.getElementById('aprendizadoReflexao')?.value || '';
    return { reflexao };
  }
  
  coletarDadosAplicacao() {
    const ideias = document.getElementById('aplicacaoIdeias')?.value || '';
    return { ideias };
  }
  
  carregarDadosCasa(casaNumero) {
    const dadosCompletos = this.getDadosSalvos();
    const dados = dadosCompletos.casas[casaNumero];
    if (dados && Object.keys(dados).length > 0) {
      this.preencherDadosCasa(casaNumero, dados);
    }
  }
  
  preencherDadosCasa(casaNumero, dados) {
    switch(casaNumero) {
      case 2:
        this.preencherDadosPassaporte(dados);
        break;
      case 3:
        this.preencherDadosAtividade(dados);
        break;
      case 4:
        this.preencherDadosAprendizado(dados);
        break;
      case 5:
        this.preencherDadosAplicacao(dados);
        break;
    }
  }
  
  preencherDadosPassaporte(dados) {
    if (dados.estudanteNome) 
      document.getElementById('estudanteNome').value = dados.estudanteNome;
    if (dados.espacoVisitado) 
      document.getElementById('espacoVisitado').value = dados.espacoVisitado;
    if (dados.modalidadeSelecao) 
      document.getElementById('modalidadeSelecao').value = dados.modalidadeSelecao;
    if (dados.checkinData) 
      document.getElementById('checkinData').value = dados.checkinData;
    if (dados.localDescricao) 
      document.getElementById('localDescricao').value = dados.localDescricao;
    
    const imagePreview = document.getElementById('imagePreview');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const removeImageBtn = document.getElementById('removeImageBtn');
    
    const temImagemReal = dados.fotoBase64 && 
                           dados.fotoBase64 !== '' && 
                           dados.fotoBase64 !== 'about:blank' &&
                           dados.fotoBase64.startsWith('data:image');
    
    if (temImagemReal) {
      imagePreview.src = dados.fotoBase64;
      imagePreview.style.display = 'block';
      uploadPlaceholder.style.display = 'none';
      if (removeImageBtn) removeImageBtn.style.display = 'inline-flex';
    } else {
      imagePreview.src = '';
      imagePreview.style.display = 'none';
      uploadPlaceholder.style.display = 'flex';
      if (removeImageBtn) removeImageBtn.style.display = 'none';
    }
  }
  
  preencherDadosAtividade(dados) {
    if (dados.experiencia1) 
      document.getElementById('experiencia1Descricao').value = dados.experiencia1;
    if (dados.experiencia2) 
      document.getElementById('experiencia2Descricao').value = dados.experiencia2;
    if (dados.experiencia3) 
      document.getElementById('experiencia3Descricao').value = dados.experiencia3;
  }
  
  preencherDadosAprendizado(dados) {
    if (dados.reflexao) 
      document.getElementById('aprendizadoReflexao').value = dados.reflexao;
  }
  
  preencherDadosAplicacao(dados) {
    if (dados.ideias) 
      document.getElementById('aplicacaoIdeias').value = dados.ideias;
  }
  
  carregarDadosSalvos() {
    for (let i = 2; i <= 5; i++) {
      this.carregarDadosCasa(i);
    }
  }
  
  finalizarSemana() {
    window.location.href = 'jornadas.html';
  }
  
  irParaCasa6() {
    this.mudarCasa(6);
  }
  
  concluirTrilha() {
    this.salvarTodosDados();
    this.marcarSemanaConcluida();
    this.verificarSemanaConcluida();

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 50);
  }
}

window.SemanaManager = SemanaManager;