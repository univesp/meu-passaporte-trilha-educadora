// ============================================
// CONCLUSÃO - GERAR PORTFÓLIO COMPLETO
// ============================================

// Cores de cada semana
const coresDasSemanas = {
  1: '#191698',   // Semana 1
  2: '#007B5F',   // Semana 2
  3: '#EC2C39',   // Semana 3
  4: '#FFD425',   // Semana 4
  5: '#844DCF',   // Semana 5
  6: '#ED6D02',   // Semana 6
  7: '#E43474'    // Semana 7
};

// Nomes das semanas
const nomesSemanas = {
  1: 'Fundamentos da Educação Não Formal / Microexpedição de Conceitos',
  2: 'Tipologias dos Espaços Educativos / Tríade de Tipologias',
  3: 'Museus e Educação Patrimonial / Olhar Patrimonial',
  4: 'Centros de Ciência / Mini Hands-on Investigativo',
  5: 'Cidade Educadora / Trilhas de Bairro',
  6: 'Mediação Pedagógica / Mediação Inclusiva',
  7: 'Articulação Escola-Território / Radar de Parceiros'
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

// Função para formatar data no padrão brasileiro
function formatarDataBrasil(dataString) {
  if (!dataString) return '<span style="color:#999;">Não preenchido</span>';
  
  const data = new Date(dataString);
  if (isNaN(data.getTime())) return '<span style="color:#999;">Data inválida</span>';
  
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  
  return `${dia}/${mes}/${ano}`;
}

// Função para gerar o HTML de uma semana específica
function gerarHTMLSemana(semanaNumero) {
  const dadosCompletos = JSON.parse(localStorage.getItem(`semana${semanaNumero}Dados`)) || { casas: {} };
  const dadosPassaporte = dadosCompletos.casas[2] || {};
  const dadosAtividade = dadosCompletos.casas[3] || {};
  const dadosAprendizado = dadosCompletos.casas[4] || {};
  const dadosAplicacao = dadosCompletos.casas[5] || {};
  
  const corPrincipal = coresDasSemanas[semanaNumero];
  const corFundoTitulo = '#e6e3e3';
  
  return `
    <div style="page-break-after: always; margin-bottom: 20px;">
      <h1 style="color: ${corPrincipal}; text-align: center; border-bottom: 2px solid ${corPrincipal}; padding-bottom: 10px;">Relatório da Trilha Educadora - Semana ${semanaNumero}</h1>
      <p style="text-align: center;"><strong>${nomesSemanas[semanaNumero]}</strong></p>
      
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
    </div>
  `;
}

// Função principal para gerar o PDF do portfólio
async function gerarPortfolioPDF() {
  const btn = document.querySelector('.baixa-portifolio-btn');
  const textoOriginal = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando Portfólio...';
  btn.disabled = true;
  
  // Verificar se todas as semanas estão concluídas
  let todasConcluidas = true;
  let semanasFaltando = [];
  
  for (let i = 1; i <= 7; i++) {
    if (!isSemanaConcluida(i)) {
      todasConcluidas = false;
      semanasFaltando.push(i);
    }
  }
  
  if (!todasConcluidas) {
    btn.innerHTML = textoOriginal;
    btn.disabled = false;
    alert(`Para gerar o portfólio completo, você precisa concluir todas as semanas!`);
    return;
  }
  
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait'
  });
  

  // ============================================
  // PÁGINA DE CAPA
  // ============================================
  const capaHTML = `
    <div style="text-align: center; padding: 40px 20px;">
      <h1 style="color: #191698; font-size: 36px; margin-bottom: 20px; font-weight: bold">Meu Passaporte da Trilha Educadora</h1>
      <p style="font-size: 26px; color: #666; margin-bottom: 10px;">Portfólio Formativo</p>
      <p style="font-size: 16px; color: #888; margin-bottom: 40px;">Disciplina: Educação em Espaços Não Formais</p>
      
      <div style="margin: 100px 0; display: flex; justify-content: center;">
        <img src="assets/img_trilha.png" alt="Mapa da Trilha" style="max-width: 80%; height: auto;">
      </div>
      
      <p style="font-size: 14px; color: #666; margin-top: 40px; line-height: 1.5;">Este portfólio reúne os registros construídos ao longo da disciplina.</p>
      
      <p style="font-size: 12px; color: #999; margin-top: 170px;">Documento gerado pelo Meu Passaporte da Trilha Educadora - Univesp</p>

      <div style="margin: 5px 0 0 0; display: flex; justify-content: center;">
        <svg version="1.1" id="Camada_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 302.1 159.3" style="enable-background:new 0 0 302.1 159.3;" xml:space="preserve"
        width="50%">
        <style type="text/css">
          .st0{fill:#D13239;}
          .st1{fill:#FFFFFF;}
          .st2{fill:#878787;}
          .st3{fill:#1D1D1B;}
        </style>
        <g>
          <polygon class="st0" points="173.8,41.2 163.7,105.6 156.5,105.6 146.1,41.2 139.4,41.2 153,117.8 166.7,117.8 180.4,41.2 	"/>
          <polygon class="st1" points="160.1,91 167.3,41.2 160.1,91 152.9,41.2 146.1,41.2 146.1,41.2 152.9,41.2 	"/>
          <polygon class="st1" points="163.7,105.6 173.8,41.2 167.3,41.2 160.1,91 152.9,41.2 146.1,41.2 156.5,105.6 	"/>
          <path class="st2" d="M48.6,41.4c-1.2,0.8-1.6,2-1.6,3.4l-0.1,19.8c-0.2,5.3,1.9,10.7,6.9,13c5.6,2.8,11.8-0.1,16.1-3.5l0.1-0.4
            L70.3,45c0.1-1.3-0.5-2.5-1.6-3.1c-0.3-0.2-0.8-0.2-0.8-0.6l0.1-0.1c2.6,0.3,5.3,0.1,8,0.1c0.1,0,0.2,0,0.2,0.1
            c-0.2,0.4-0.7,0.4-1.1,0.7c-1.2,1.1-1.3,2.9-1.3,4.5l-0.4,27.7c0.1,1.5-0.1,3.5,1.3,4.4c0.4,0.3,0.8,0.3,1.2,0.6
            c0,0.1-0.1,0.2-0.2,0.2c-2.4-0.1-4.9-0.4-7.3-0.1c-0.1-0.1-0.1-0.1-0.1-0.2c1.3-0.8,1.7-2.4,1.7-4c-0.2-0.2-0.3,0.1-0.6,0.3
            c-4.9,3.6-11.5,5.9-17.6,3.5c-4.3-1.4-7.4-5.9-7.8-10.2c-0.5-4-0.2-12.6-0.2-12.6c0.1-3.9,0.2-8-0.1-11.9C43.6,43,42.2,42,41,41.6
            c0-0.1,0.1-0.2,0.2-0.2c2.4,0,4.6,0.3,6.9-0.1h0.5C48.6,41.3,48.6,41.4,48.6,41.4z M87,76.9c0.1,0.8,0.8,1.4,1.4,1.7
            c0.4,0.2,1,0.2,1.3,0.5l-0.2,0.2c-2.6-0.2-6.7-0.1-7.9,0.1c-0.2-0.4,1-0.5,1.4-0.8c1.1-0.6,1.5-1.7,1.5-2.8l0.3-32.1
            c-0.6-1.1-1.8-1.9-3-2.1c-0.2-0.1-0.1-0.2-0.1-0.3l0.3-0.1c2.4,0.2,4.9,0.2,7.2-0.2c0.1,0.4-0.3,0.7-0.3,1.1
            c-0.2,0.8,0,1.5,0.4,2.2l23.6,27.5l0.2-0.1l0.1-25.4c-0.1-1.5-0.1-3-1.4-3.9c-0.4-0.4-1.1-0.3-1.5-0.7l0.4-0.2
            c2.4,0.1,5.2,0.2,7.6-0.2l0.1,0.1c0.1,0.3-0.3,0.4-0.4,0.4c-0.7,0.2-1.5,0.5-2,1.2c-0.9,2.6-0.4,4.9-0.6,7.8V52l-0.2,26.9
            c-0.1,0.3,0.1,0.6-0.1,0.7l-0.2-0.1l-12.6-14.9c-5.3-6-10.2-12.2-15.4-18.1h-0.1C86.8,51.4,86.4,72.2,87,76.9 M130.9,42.3
            c-1.5,1-1.2,2-1.3,3.5c0,0-0.1,29.4,0.3,31.8c0.2,0.9,1.1,1.3,1.8,1.8l-0.3,0.2c-2.4-0.4-5.1-0.2-7.6-0.1c-0.2-0.4,0.5-0.3,0.7-0.6
            c0.5-0.1,1.2-0.5,1.3-1.1l0.3-1.6V45.6c-0.1-1.1-0.2-2.4-1.2-3l-0.2-0.3c-0.5-0.4-1.3-0.2-1.5-0.7l0.2-0.1c2.8,0.3,5.8,0.3,8.5-0.1
            c0.2,0,0.3-0.1,0.6,0C132.2,41.9,131.4,41.9,130.9,42.3 M199.6,60.2c-2.6-0.2-5.4-0.1-8,0.2l-0.1,0.2c-0.1,5.6-0.2,11.3,0.1,16.9
            l0.2,0.1c3.8-0.3,8.7,0.3,12.7-0.5c1.2-0.3,2.2-1.5,2.7-2.6c0.1-0.1,0.2-0.1,0.2,0l0.1,0.1c-0.3,1.3-0.7,2.5-1.3,3.8
            c-0.3,0.6-1,0.8-1.6,1c-6.6,0.1-12.3-0.4-18.9,0c-0.1-0.1-0.1-0.2-0.1-0.3c0.7-0.3,1.9-0.9,2.2-2.1l0.2-1.5l0.1-10V46.2
            c-0.1-1.3,0-3.2-1.3-4.2c-0.2-0.3-0.8-0.2-0.8-0.8h0.2c4.9,0,9.6-0.1,14.6-0.2c0.3,0.1,0.8,0.1,1,0.3c0.7,0.9,0.8,1.9,0.9,3
            c-0.2,0.2-0.3-0.1-0.4-0.2c-0.7-1.3-2-1.6-3.4-1.5l-7.2,0.2l-0.2,0.1c0,5.2-0.2,10.4,0.1,15.5l0.2,0.1c3-0.1,6.1,0.1,9-0.4
            c0.8-0.3,1.6-1,1.9-1.8c0.1-0.1,0.2-0.1,0.3-0.1c-0.2,1.9-0.2,3.8-0.1,5.7c-0.1,0.1-0.2,0.1-0.2,0C202.7,62,203.2,60.5,199.6,60.2
              M231.1,42.6v0.2c0.1,1.4,0.2,2.7-0.1,4c-0.1,0.2-0.2,0.1-0.2,0.1c-1-2-3.1-4.1-5.4-4.3c-3.1-0.7-6.4,0.3-8.1,3
            c-1.1,1.9-1,4.6,0,6.5c0.8,1.3,2.4,2.6,3.7,3.9c3.3,2.6,6.8,4.8,10.1,7.8c2.1,2.4,2.6,6.3,1.6,9.2c-0.9,3-3.7,5.9-6.8,6.5
            c-3.8,1-7.7-0.2-11.5-0.4c-0.1-2-0.3-3.9-0.4-6c0-0.2,0.2-0.2,0.4-0.2c0.3,0.6,0.3,1.2,0.6,1.8c1.6,3.5,5.4,4.2,8.9,3.9
            c2.6-0.2,5.4-1.9,6.3-4.5c1-2.4,0.3-5.3-1.3-7.2c-1.3-1.6-2.9-2.8-4.4-3.9c-3.9-3.2-10.1-6.3-10.1-12.1c-0.1-3.3,1.2-6.3,4.1-8.2
            C222.1,40.2,227.2,41.4,231.1,42.6 M259.4,45.1c2.1,2.8,2.2,7.2,0.7,10.3c-1.4,3.2-4.8,5.2-8.1,5.4c-1.6,0.2-3.2,0.1-4.7-0.2
            c-0.1-0.1-0.2-0.2-0.1-0.4l0.3-0.1c3.1,0.4,6.4,0.2,8.5-2.3c2.4-3,2.4-8,0.7-11.3c-1-2.2-3.3-3.9-5.7-4.2c-1.6-0.2-3.6,0-5.1,0.4
            l-0.1,0.2l-0.2,8.1l0.1,25.1c0.1,1.1,0.7,2.5,1.9,2.8c0.3,0.1,0.8,0.1,0.9,0.4c-0.4,0.4-1.1,0.1-1.6,0.2c-2.4-0.3-4.8-0.3-7,0.1
            c-0.2,0-0.3,0-0.4-0.1l0.1-0.3c0.8-0.3,2-0.6,2.6-1.6l0.2-1.3l0.2-16.2L242.5,45c-0.1-1.4-1-2.6-2.2-3.3c-0.1-0.2,0-0.3,0.2-0.3
            C246.8,41.8,255.1,39.1,259.4,45.1"/>
          <polygon class="st3" points="152.9,41.2 167.3,41.2 160.1,91 	"/>
        </g>
        </svg>
      </div>
    </div>
  `;
  
  const capaDiv = document.createElement('div');
  capaDiv.style.position = 'absolute';
  capaDiv.style.left = '-9999px';
  capaDiv.style.top = '0';
  capaDiv.style.width = '800px';
  capaDiv.style.backgroundColor = 'white';
  capaDiv.style.padding = '40px';
  capaDiv.innerHTML = capaHTML;
  document.body.appendChild(capaDiv);
  
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const capaCanvas = await html2canvas(capaDiv, { 
    scale: 2, 
    backgroundColor: '#ffffff',
    logging: false
  });
  const capaImgData = capaCanvas.toDataURL('image/jpeg', 1.0);
  const imgWidth = 190;
  const capaImgHeight = (capaCanvas.height * imgWidth) / capaCanvas.width;
  pdf.addImage(capaImgData, 'JPEG', 10, 0, imgWidth, capaImgHeight);
  document.body.removeChild(capaDiv);
  
  // ============================================
  // GERAR CADA SEMANA EM UMA NOVA PÁGINA
  // ============================================
  for (let i = 1; i <= 7; i++) {
    const htmlSemana = gerarHTMLSemana(i);
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '800px';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '40px';
    tempDiv.innerHTML = htmlSemana;
    document.body.appendChild(tempDiv);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const canvas = await html2canvas(tempDiv, { 
      scale: 2, 
      backgroundColor: '#ffffff',
      logging: false
    });
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pageHeight = 277;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    document.body.removeChild(tempDiv);
  }
  
  // ============================================
  // SALVAR O PDF
  // ============================================
  pdf.save('Meu_Passaporte_Trilha_Educadora.pdf');
  
  btn.innerHTML = textoOriginal;
  btn.disabled = false;
}

// Configurar o botão quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  const btnPortfolio = document.querySelector('.baixa-portifolio-btn');
  
  if (btnPortfolio) {
    // Remove qualquer evento anterior
    const novoBtn = btnPortfolio.cloneNode(true);
    btnPortfolio.parentNode.replaceChild(novoBtn, btnPortfolio);
    
    novoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      gerarPortfolioPDF();
    });
  }
});