// ============================================
// JORNADAS - GERENCIAMENTO DE PROGRESSO
// ============================================

// Cores de cada semana (para o background do card quando concluído)
const coresDasSemanas = {
  1: '#191698',   // Semana 1
  2: '#007B5F',   // Semana 2
  3: '#EC2C39',   // Semana 3
  4: '#FFD425',   // Semana 4
  5: '#844DCF',   // Semana 5
  6: '#ED6D02',   // Semana 6
  7: '#E43474'    // Semana 7
};

// Função para verificar se uma semana está concluída
function isSemanaConcluida(semanaNumero) {
  const dados = localStorage.getItem(`semana${semanaNumero}Dados`);
  if (dados) {
    const dadosParseados = JSON.parse(dados);
    return dadosParseados.semanaConcluida === true;
  }
  return false;
}

// Função para atualizar a barra de progresso (steps)
function atualizarBarraProgresso() {
  for (let i = 1; i <= 7; i++) {
    const step = document.querySelector(`.step:nth-child(${i}) .circle`);
    if (step) {
      const concluida = isSemanaConcluida(i);
      
      if (concluida) {
        // Substitui o círculo vazio pelo círculo com check
        const parentStep = step.parentElement;
        
        // Cria o novo elemento com o check
        const novoCirculo = document.createElement('div');
        novoCirculo.className = 'circle done';
        novoCirculo.innerHTML = `
          <svg viewBox="0 0 24 24" class="check-icon">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        
        // Substitui o círculo antigo pelo novo
        step.replaceWith(novoCirculo);
      } else {
        // Se não está concluída e é um círculo com check, restaura
        if (step.classList.contains('done')) {
          const novoCirculo = document.createElement('div');
          novoCirculo.className = 'circle';
          
          step.replaceWith(novoCirculo);
        }
      }
    }
  }
}

// Função para atualizar os cards das semanas
function atualizarCards() {
  for (let i = 1; i <= 7; i++) {
    const card = document.querySelector(`.card[data-card="${i}"]`);
    if (!card) continue;
    
    const statusCircle = card.querySelector('.status-circle');
    const cardHeader = card.querySelector('.card-header');
    const cardIcon = card.querySelector('.card-icon');
    const cardWeek = card.querySelector('.card-week');
    const cardSubtitle = card.querySelector('.card-subtitle');
    const cardLink = card.querySelector('.card-link');
    
    const concluida = isSemanaConcluida(i);
    
    if (concluida) {
      // Marca como concluída
      if (statusCircle) {
        statusCircle.classList.add('done');
        // Deixa a borda branca
        statusCircle.style.borderColor = '#FFFFFF';
        // Garante que o after (check) fique branco também
        statusCircle.style.color = '#FFFFFF';
      }
      
      // Altera o background do card-header para a cor da semana
      if (cardHeader) {
        cardHeader.style.backgroundColor = coresDasSemanas[i];
        cardHeader.style.transition = 'background-color 0.3s ease';
      }
      
      // Deixa todos os elementos internos em branco
      if (cardIcon) {
        cardIcon.style.filter = 'invert(1)';
      }
      if (cardWeek) {
        cardWeek.style.color = '#FFFFFF';
      }
      if (cardSubtitle) {
        cardSubtitle.style.color = '#FFFFFF';
      }
      
      // Muda o texto do link
      if (cardLink) {
        cardLink.textContent = 'Revisitar trilha >>>';
      }
    } else {
      // Não concluída
      if (statusCircle) {
        statusCircle.classList.remove('done');
        // Restaura a borda original
        statusCircle.style.borderColor = '';
        statusCircle.style.color = '';
      }
      
      // Restaura o background original (remove o inline style)
      if (cardHeader) {
        cardHeader.style.backgroundColor = '';
      }
      
      // Restaura as cores originais
      if (cardIcon) {
        cardIcon.style.filter = '';
      }
      if (cardWeek) {
        cardWeek.style.color = '';
      }
      if (cardSubtitle) {
        cardSubtitle.style.color = '';
      }
      
      // Muda o texto do link de volta
      if (cardLink) {
        cardLink.textContent = 'Iniciar trilha >>>';
      }
    }
  }
}

// Função para calcular e atualizar a barra de progresso geral
function atualizarProgressoGeral() {
  let totalConcluidas = 0;
  for (let i = 1; i <= 7; i++) {
    if (isSemanaConcluida(i)) totalConcluidas++;
  }
  
  const porcentagem = (totalConcluidas / 7) * 100;
  const barraFundo = document.querySelector('.barra-fundo');
  
  if (barraFundo) {
    let barraPreenchida = document.querySelector('.barra-preenchida');
    if (!barraPreenchida) {
      barraPreenchida = document.createElement('div');
      barraPreenchida.className = 'barra-preenchida';
      barraFundo.appendChild(barraPreenchida);
    }
    barraPreenchida.style.width = `${porcentagem}%`;
    barraPreenchida.style.transition = 'width 0.5s ease';
  }
  
  // RETORNA O TOTAL DE SEMANAS CONCLUÍDAS
  return totalConcluidas;
}

// Função para configurar os cards como clicáveis
function configurarCards() {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    const semana = card.dataset.card;
    const link = card.querySelector('.card-link');
    
    if (link) {
      // Remove qualquer evento anterior e adiciona novo
      const novoLink = link.cloneNode(true);
      link.parentNode.replaceChild(novoLink, link);
      
      novoLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `semana-${semana}.html`;
      });
    }
  });
}

// Função para verificar se todas as semanas estão concluídas
function verificarConclusaoTotal(totalConcluidas) {
  console.log('Total de semanas concluídas:', totalConcluidas); // DEBUG
  
  const botaoConcluirPassaporte = document.querySelector('.btn-action-jornadas:last-child');
  console.log('Botão encontrado:', botaoConcluirPassaporte); // DEBUG
  
  if (!botaoConcluirPassaporte) return;
  
  // Remove qualquer evento anterior clonando o botão
  const novoBotao = botaoConcluirPassaporte.cloneNode(true);
  botaoConcluirPassaporte.parentNode.replaceChild(novoBotao, botaoConcluirPassaporte);
  
  // Remove qualquer estilo inline que possa ter sido aplicado
  novoBotao.style.backgroundColor = '';
  novoBotao.style.cursor = '';
  novoBotao.style.opacity = '';
  
  if (totalConcluidas === 7) {
    console.log('TODAS CONCLUÍDAS! Habilitando botão...'); // DEBUG
    // Todas as semanas concluídas - Redireciona pra página Conclusão
    novoBotao.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'conclusao.html';
    });
  } else {
    console.log('FALTAM SEMANAS! Desabilitando botão...'); // DEBUG
    // Ainda não completou todas as semanas - botão desabilitado
    novoBotao.style.backgroundColor = '#EBEBE4';
    novoBotao.style.cursor = 'not-allowed';
    novoBotao.addEventListener('click', (e) => {
      e.preventDefault();
      alert(`Complete todas as 7 semanas primeiro!`);
    });
  }
}

// Inicializar tudo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  console.log('Inicializando página de jornadas...');
  
  // Atualiza todos os elementos
  atualizarBarraProgresso();
  atualizarCards();
  const totalConcluidas = atualizarProgressoGeral();
  configurarCards();
  verificarConclusaoTotal(totalConcluidas);
  
  console.log('Jornadas inicializada!');
});

// Opcional: Adicionar evento de armazenamento para atualizar em tempo real
// Caso o usuário mude os dados em outra aba
window.addEventListener('storage', () => {
  atualizarBarraProgresso();
  atualizarCards();
  const totalConcluidas = atualizarProgressoGeral();
  verificarConclusaoTotal(totalConcluidas);
});