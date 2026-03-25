// Garantir que a página comece no topo ao carregar
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});

// Configurar cards da semana
function configurarCardsSemana() {
  const cards = document.querySelectorAll('[data-card]');
  
  cards.forEach(card => {
    const semana = card.dataset.card;
    card.addEventListener('click', () => {
      window.location.href = `semana-${semana}.html`;
    });
  });
}

configurarCardsSemana();

// Inicializar o gerenciador de casas quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  const semanaContent = document.querySelector('.semana-content-box');
  if (semanaContent) {
    const semanaMatch = semanaContent.id.match(/semana(\d+)/);
    const semanaId = semanaMatch ? parseInt(semanaMatch[1]) : 1;
    
    const manager = new SemanaManager({
      semanaId: semanaId,
      totalCasas: 6,
      onCasaChange: (casa) => {}
    });
    
    window.semanaManager = manager;
  }
});

// Função para redimensionar imagem
function resizeImage(file, maxWidth, maxHeight, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      callback(dataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Upload de imagem
const imageUploadContainer = document.getElementById('imageUploadContainer');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const removeImageBtn = document.getElementById('removeImageBtn');

function updateImageInterface(hasImage, imageSrc = '') {
  if (hasImage && imageSrc) {
    imagePreview.src = imageSrc;
    imagePreview.style.display = 'block';
    uploadPlaceholder.style.display = 'none';
    if (removeImageBtn) removeImageBtn.style.display = 'inline-flex';
  } else {
    imagePreview.src = '';
    imagePreview.style.display = 'none';
    uploadPlaceholder.style.display = 'flex';
    if (removeImageBtn) removeImageBtn.style.display = 'none';
  }
  
  if (window.semanaManager) {
    window.semanaManager.salvarTodosDados();
  }
}

function processImageFile(file) {
  if (!file) return;
  
  if (file.type.startsWith('image/')) {
    resizeImage(file, 800, 600, function(resizedImage) {
      updateImageInterface(true, resizedImage);
    });
  } else {
    alert('Por favor, selecione um arquivo de imagem válido (jpg, png, gif, etc.)');
  }
}

if (imageUploadContainer) {
  imageUploadContainer.addEventListener('click', () => {
    imageUpload.value = '';
    imageUpload.click();
  });
}

if (imageUpload) {
  imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      processImageFile(file);
    }
  });
}

if (removeImageBtn) {
  removeImageBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    updateImageInterface(false);
    imageUpload.value = '';
  });
}

// Auto-salvar nos inputs do formulário (casa 2)
const formInputsCasa2 = ['estudanteNome', 'espacoVisitado', 'modalidadeSelecao', 'checkinData', 'localDescricao'];
formInputsCasa2.forEach(inputId => {
  const input = document.getElementById(inputId);
  if (input) {
    input.addEventListener('change', () => {
      if (window.semanaManager) window.semanaManager.salvarTodosDados();
    });
    input.addEventListener('input', () => {
      if (window.semanaManager) window.semanaManager.salvarTodosDados();
    });
  }
});

// Auto-salvar nos textareas (casa 3)
const formInputsCasa3 = ['experiencia1Descricao', 'experiencia2Descricao', 'experiencia3Descricao'];
formInputsCasa3.forEach(inputId => {
  const input = document.getElementById(inputId);
  if (input) {
    input.addEventListener('change', () => {
      if (window.semanaManager) window.semanaManager.salvarTodosDados();
    });
    input.addEventListener('input', () => {
      if (window.semanaManager) window.semanaManager.salvarTodosDados();
    });
  }
});

// Auto-salvar no textarea (casa 4)
const aprendizadoReflexao = document.getElementById('aprendizadoReflexao');
if (aprendizadoReflexao) {
  aprendizadoReflexao.addEventListener('change', () => {
    if (window.semanaManager) window.semanaManager.salvarTodosDados();
  });
  aprendizadoReflexao.addEventListener('input', () => {
    if (window.semanaManager) window.semanaManager.salvarTodosDados();
  });
}

// Auto-salvar no textarea (casa 5)
const aplicacaoIdeias = document.getElementById('aplicacaoIdeias');
if (aplicacaoIdeias) {
  aplicacaoIdeias.addEventListener('change', () => {
    if (window.semanaManager) window.semanaManager.salvarTodosDados();
  });
  aplicacaoIdeias.addEventListener('input', () => {
    if (window.semanaManager) window.semanaManager.salvarTodosDados();
  });
}

// ============================================
// BOTÃO GERAR PDF NA CASA 6 - COM COR DINÂMICA
// ============================================
setTimeout(() => {
  const gerarPdfBtn = document.querySelector('.bottom-action.conteudo-casa-6 button:first-child');
  
  if (gerarPdfBtn && gerarPdfBtn.textContent === 'Gerar PDF') {
    const novoBtn = gerarPdfBtn.cloneNode(true);
    gerarPdfBtn.parentNode.replaceChild(novoBtn, gerarPdfBtn);
    
    novoBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      
      const btn = novoBtn;
      const textoOriginal = btn.innerText;
      btn.innerText = 'Gerando PDF...';
      btn.disabled = true;
      
      const coresDasSemanas = {
        1: '#191698',   // Semana 1
        2: '#007B5F',   // Semana 2
        3: '#EC2C39',   // Semana 3
        4: '#FFD425',   // Semana 4
        5: '#844DCF',   // Semana 5
        6: '#ED6D02',    // Semana 6
        7: '#E43474'     // Semana 7 
      };
      
      // Detecta qual semana estamos (pelo ID ou classe)
      let semanaAtual = 1;
      const semanaContent = document.querySelector('.semana-content-box');
      if (semanaContent && semanaContent.id) {
        const match = semanaContent.id.match(/semana(\d+)/);
        if (match) semanaAtual = parseInt(match[1]);
      }
      
      const corPrincipal = coresDasSemanas[semanaAtual] || '#191698';
      const corFundoTitulo = '#e6e3e3'; // Cor de fundo dos títulos
      // ============================================
      
      // Busca os dados do localStorage unificado
      const dadosCompletos = JSON.parse(localStorage.getItem(`semana${semanaAtual}Dados`)) || { casas: {} };
      const dadosPassaporte = dadosCompletos.casas[2] || {};
      const dadosAtividade = dadosCompletos.casas[3] || {};
      const dadosAprendizado = dadosCompletos.casas[4] || {};
      const dadosAplicacao = dadosCompletos.casas[5] || {};

      // Cria um elemento temporário para renderizar
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '40px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';

      // Formata a data para o padrão brasileiro
      function formatarDataBrasil(dataString) {
        if (!dataString) return '<span style="color:#999;">Não preenchido</span>';
        
        const data = new Date(dataString);
        if (isNaN(data.getTime())) return '<span style="color:#999;">Data inválida</span>';
        
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        
        return `${dia}/${mes}/${ano}`;
      }

      tempDiv.innerHTML = `
        <h1 style="color: ${corPrincipal}; text-align: center; border-bottom: 2px solid ${corPrincipal}; padding-bottom: 10px;">Relatório da Trilha Educadora - Semana ${semanaAtual}</h1>
        <p style="text-align: center;"><strong>${document.querySelector('.semana-titulo span')?.innerText || 'Fundamentos da Educação Não Formal / Microexpedição de Conceitos'}</strong></p>
        
        <h2 style="background-color: ${corFundoTitulo}; color: #000; margin-top: 30px; padding: 10px; font-size: 24px; border-left: 5px solid ${corPrincipal};">1. Passaporte da Visita</h2>
        <p><strong>Nome do estudante:</strong> ${dadosPassaporte.estudanteNome || '<span style="color:#999;">Não preenchido</span>'}</p>
        <p><strong>Espaço visitado:</strong> ${dadosPassaporte.espacoVisitado || '<span style="color:#999;">Não preenchido</span>'}</p>
        <p><strong>Modalidade:</strong> ${dadosPassaporte.modalidadeSelecao || '<span style="color:#999;">Não preenchido</span>'}</p>
        <p><strong>Data da visita:</strong> ${formatarDataBrasil(dadosPassaporte.checkinData)}</p>
        <p><strong>Descrição do local:</strong> ${dadosPassaporte.localDescricao || '<span style="color:#999;">Não preenchido</span>'}</p>
        ${dadosPassaporte.fotoBase64 && dadosPassaporte.fotoBase64.startsWith('data:image') ? 
          `<p><strong>Foto:</strong></p><img src="${dadosPassaporte.fotoBase64}" style="max-width: 300px; max-height: 200px; border: 1px solid #ccc; border-radius: 8px; margin-top: 5px;">` : ''}
        
        <h2 style="background-color: ${corFundoTitulo}; color: #000; margin-top: 30px; padding: 10px; font-size: 24px; border-left: 5px solid ${corPrincipal};">2. Experiências de Aprendizagem</h2>
        <p><strong>Experiência 1:</strong> ${dadosAtividade.experiencia1 || '<span style="color:#999;">Não preenchido</span>'}</p>
        <p><strong>Experiência 2:</strong> ${dadosAtividade.experiencia2 || '<span style="color:#999;">Não preenchido</span>'}</p>
        <p><strong>Experiência 3:</strong> ${dadosAtividade.experiencia3 || '<span style="color:#999;">Não preenchido</span>'}</p>
        
        <h2 style="background-color: ${corFundoTitulo}; color: #000; margin-top: 30px; padding: 10px; font-size: 24px; border-left: 5px solid ${corPrincipal};">3. Reflexão sobre o Aprendizado</h2>
        <p><strong>O que aprendi com a visita:</strong> ${dadosAprendizado.reflexao || '<span style="color:#999;">Não preenchido</span>'}</p>
        
        <h2 style="background-color: ${corFundoTitulo}; color: #000; margin-top: 30px; padding: 10px; font-size: 24px; border-left: 5px solid ${corPrincipal};">4. Aplicação Prática</h2>
        <p><strong>Como essa experiência pode inspirar a escola:</strong> ${dadosAplicacao.ideias || '<span style="color:#999;">Não preenchido</span>'}</p>
        
        <hr style="margin-top: 40px;">
        <p style="text-align: center; color: #666; font-size: 12px;">Documento gerado pelo Meu Passaporte da Trilha Educadora - Univesp</p>
      `;
      
      document.body.appendChild(tempDiv);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false
        });
        
        const { jsPDF } = window.jspdf;
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF({
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        });
        
        const imgWidth = 190;
        const pageHeight = 277;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save(`Meu_Passaporte_Semana${semanaAtual}.pdf`);
        
        document.body.removeChild(tempDiv);

        // ============================================
        // LIMPAR DADOS DO USUÁRIO, MAS MANTER A FLAG DE CONCLUSÃO
        // ============================================
        // Busca os dados atuais
        const dadosAtuais = JSON.parse(localStorage.getItem(`semana${semanaAtual}Dados`)) || { semanaConcluida: false, casas: {} };

        // Mantém a flag de conclusão
        const semanaConcluida = dadosAtuais.semanaConcluida;

        // Recria o objeto mantendo apenas a flag de conclusão e limpando os dados das casas
        const novosDados = {
          semanaConcluida: semanaConcluida,
          casas: {
            2: {},
            3: {},
            4: {},
            5: {}
          }
        };

        // Salva os dados limpos (mantendo a flag)
        localStorage.setItem(`semana${semanaAtual}Dados`, JSON.stringify(novosDados));

        // Limpar todos os campos do formulário na tela
        const inputsCasa2 = ['estudanteNome', 'espacoVisitado', 'modalidadeSelecao', 'checkinData', 'localDescricao'];
        inputsCasa2.forEach(id => {
          const input = document.getElementById(id);
          if (input) input.value = '';
        });

        const imagePreviewEl = document.getElementById('imagePreview');
        const uploadPlaceholderEl = document.getElementById('uploadPlaceholder');
        const removeImageBtnEl = document.getElementById('removeImageBtn');
        if (imagePreviewEl) imagePreviewEl.src = '';
        if (uploadPlaceholderEl) uploadPlaceholderEl.style.display = 'flex';
        if (removeImageBtnEl) removeImageBtnEl.style.display = 'none';

        const inputsCasa3 = ['experiencia1Descricao', 'experiencia2Descricao', 'experiencia3Descricao'];
        inputsCasa3.forEach(id => {
          const input = document.getElementById(id);
          if (input) input.value = '';
        });

        const aprendizadoReflexaoEl = document.getElementById('aprendizadoReflexao');
        if (aprendizadoReflexaoEl) aprendizadoReflexaoEl.value = '';

        const aplicacaoIdeiasEl = document.getElementById('aplicacaoIdeias');
        if (aplicacaoIdeiasEl) aplicacaoIdeiasEl.value = '';

        btn.innerText = textoOriginal;
        btn.disabled = false;
        
      } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        document.body.removeChild(tempDiv);
        btn.innerText = textoOriginal;
        btn.disabled = false;
        alert('Erro ao gerar PDF. Tente novamente.');
      }
    });
  }
}, 500);

// ============================================
// BOTÃO VOLTAR PARA JORNADAS NA CASA 6
// ============================================
setTimeout(() => {
  const voltarJornadasBtn = document.querySelector('.voltar-jornadas');
  
  if (voltarJornadasBtn && voltarJornadasBtn.textContent === 'Voltar para Jornadas') {
    const novoBtn = voltarJornadasBtn.cloneNode(true);
    voltarJornadasBtn.parentNode.replaceChild(novoBtn, voltarJornadasBtn);
    
    novoBtn.addEventListener('click', () => {
      window.location.href = 'jornadas.html';
    });
  }
}, 500);

// ============================================
// BOTÃO CONCLUIR TRILHA NA CASA 5
// ============================================
setTimeout(() => {
  let btnConcluir = document.querySelector('.bottom-action.conteudo-casa-5 button:last-child');
  
  if (btnConcluir && btnConcluir.textContent === 'Concluir Trilha') {
    const novoBotao = btnConcluir.cloneNode(true);
    btnConcluir.parentNode.replaceChild(novoBotao, btnConcluir);
    
    novoBotao.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (window.semanaManager) {
        window.semanaManager.concluirTrilha();
      }
    });
  }
}, 500);

// ============================================
// BOTÃO REINICIAR TRILHA NA CASA 6
// ============================================
setTimeout(() => {
  const botoesCasa6 = document.querySelectorAll('.bottom-action.conteudo-casa-6 button');
  let reiniciarBtn = null;
  
  botoesCasa6.forEach(btn => {
    if (btn.textContent === 'Reiniciar Trilha') {
      reiniciarBtn = btn;
    }
  });
  
  if (reiniciarBtn) {
    const novoBtn = reiniciarBtn.cloneNode(true);
    reiniciarBtn.parentNode.replaceChild(novoBtn, reiniciarBtn);
    
    novoBtn.addEventListener('click', () => {
      if (window.semanaManager) {
        window.semanaManager.reiniciarTrilha();
      }
    });
  }
}, 500);

// ============================================
// LOADING SCREEN
// ============================================
// Tempo mínimo de exibição do loading (em milissegundos)
const TEMPO_MINIMO_LOADING = 1800; 
let inicioLoading = Date.now();

// Função para esconder o loading após garantir o tempo mínimo
function esconderLoading() {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;
  
  const tempoDecorrido = Date.now() - inicioLoading;
  const tempoRestante = TEMPO_MINIMO_LOADING - tempoDecorrido;
  
  if (tempoRestante > 0) {
    // Se ainda não passou o tempo mínimo, espera mais um pouco
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }, tempoRestante);
  } else {
    // Se já passou o tempo mínimo, esconde imediatamente
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }
}

// Quando o DOM estiver pronto, já podemos preparar
document.addEventListener('DOMContentLoaded', () => {
  const semanaContent = document.querySelector('.semana-content-box');
  if (semanaContent) {
    const semanaMatch = semanaContent.id.match(/semana(\d+)/);
    const semanaId = semanaMatch ? parseInt(semanaMatch[1]) : 1;
    
    const manager = new SemanaManager({
      semanaId: semanaId,
      totalCasas: 6,
      onCasaChange: (casa) => {}
    });
    
    window.semanaManager = manager;
  }
});

// Quando a página carregar completamente, esconde o loading (respeitando tempo mínimo)
window.addEventListener('load', () => {
  esconderLoading();
  // Garantir que a página comece no topo
  window.scrollTo(0, 0);
});

// Fallback: se algo der errado, esconde no tempo máximo de 3 segundos
setTimeout(() => {
  esconderLoading();
}, 3000);