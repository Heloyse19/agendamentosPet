emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);

class AgendamentoManager {
    constructor() {
        this.agendamentos = this.carregarAgendamentos();
        this.proximoNumero = this.gerarProximoNumero();
    }

    carregarAgendamentos() {
        const dados = localStorage.getItem('agendamentos');
        return dados ? JSON.parse(dados) : [];
    }

    salvarAgendamentos() {
        localStorage.setItem('agendamentos', JSON.stringify(this.agendamentos));
        this.atualizarLista();
    }

    gerarProximoNumero() {
        if (this.agendamentos.length === 0) return 'A001';

        const ultimoNumero = this.agendamentos[this.agendamentos.length - 1].numeroAtendimento;
        const numero = parseInt(ultimoNumero.substring(1)) + 1;
        return 'A' + numero.toString().padStart(3, '0');
    }

    formatarData(dataString) {
        const data = new Date(dataString);
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();
        const horas = data.getHours().toString().padStart(2, '0');
        const minutos = data.getMinutes().toString().padStart(2, '0');

        return {
            completa: `${dia}/${mes}/${ano} ${horas}:${minutos}`,
            dia: dia,
            mes: mes,
            ano: ano,
            hora: `${horas}:${minutos}`
        };
    }

    adicionarAgendamento(dados) {
        const dataFormatada = this.formatarData(dados.dataAgendamento);

        const agendamento = {
            id: Date.now(),
            numeroAtendimento: this.proximoNumero,
            tutor: dados.tutor,
            pet: dados.pet,
            raca: dados.raca,
            peso: dados.peso,
            tipo: dados.tipo,
            data: dados.dataAgendamento,
            dataFormatada: dataFormatada.completa,
            dataObj: dataFormatada,
            observacoes: dados.observacoes || '',
            dataCriacao: new Date().toLocaleString('pt-BR')
        };

        this.agendamentos.push(agendamento);
        this.salvarAgendamentos();

        this.proximoNumero = this.gerarProximoNumero();

        return agendamento;
    }

    removerAgendamento(id) {
        this.agendamentos = this.agendamentos.filter(a => a.id !== id);
        this.salvarAgendamentos();
    }

    getTipoLabel(tipo) {
        const tipos = {
            'consulta': 'Consulta',
            'exame': 'Exame',
            'cirurgia': 'Cirurgia'
        };
        return tipos[tipo] || tipo;
    }

    atualizarLista() {
        const lista = document.getElementById('agendamentosList');
        
        if (this.agendamentos.length === 0) {
            lista.innerHTML = '<div class="no-agendamentos">Nenhum agendamento cadastrado</div>';
            return;
        }
        
        const agendamentosOrdenados = [...this.agendamentos].sort((a, b) => 
            new Date(b.data) - new Date(a.data)
        );
        
        lista.innerHTML = agendamentosOrdenados.map(ag => {
            const agJson = JSON.stringify(ag).replace(/"/g, '&quot;');
            return `
            <div class="agendamento-card" data-id="${ag.id}">
                <button class="delete-btn" onclick="manager.removerAgendamento(${ag.id})">×</button>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span class="tipo-badge tipo-${ag.tipo}">${this.getTipoLabel(ag.tipo)}</span>
                    <span style="font-weight: bold; color: #00459b;">#${ag.numeroAtendimento}</span>
                </div>
                
                <h3>${ag.pet}</h3>
                <p><strong>Tutor:</strong> ${ag.tutor}</p>
                <p><strong>Raça:</strong> ${ag.raca} | <strong>Peso:</strong> ${ag.peso}kg</p>
                <p><strong>Data:</strong> ${ag.dataFormatada}</p>
                ${ag.observacoes ? `<p><strong>Obs:</strong> ${ag.observacoes}</p>` : ''}
                
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button onclick="manager.gerarPDF(${agJson})" 
                            style="background: #28a745; flex: 1; padding: 8px; font-size: 14px;">
                        📄 PDF
                    </button>
                    <button onclick="manager.enviarEmail(${ag.id})" 
                            style="background: #007bff; flex: 1; padding: 8px; font-size: 14px;">
                        📧 Email
                    </button>
                </div>
                
                <small style="display: block; text-align: right; margin-top: 10px; color: #999;">
                    Agendado em: ${ag.dataCriacao}
                </small>
            </div>
        `}).join('');
    }

    gerarPDF(agendamento) {
        // Verifica se a biblioteca está carregada
        if (typeof window.jspdf === 'undefined') {
            console.error('jsPDF não está carregado!');
            alert('Erro: Biblioteca PDF não carregada. Recarregue a página.');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFont('helvetica');

        doc.setFontSize(18);
        doc.setTextColor(0, 69, 155);
        doc.text('COMPROVANTE DE AGENDAMENTO', 20, 20);
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Clínica Veterinária Pet', 20, 30);

        doc.setDrawColor(0, 69, 155);
        doc.line(20, 35, 190, 35);

        doc.setFontSize(12);
        doc.text(`Tutor: ${agendamento.tutor}`, 20, 50);
        doc.text(`Pet: ${agendamento.pet}`, 20, 60);
        doc.text(`Raça: ${agendamento.raca}`, 20, 70);
        doc.text(`Peso: ${agendamento.peso} kg`, 20, 80);
        doc.text(`Tipo do agendamento: ${agendamento.tipo}`, 20, 90);
        doc.text(`Número do atendimento: ${agendamento.numeroAtendimento}`, 20, 100);

        doc.setFontSize(11);
        const texto = `Informamos que o agendamento do pet ${agendamento.pet.toUpperCase()} está marcado para o dia ${agendamento.dataObj.dia}/${agendamento.dataObj.mes}/${agendamento.dataObj.ano} às ${agendamento.dataObj.hora}. Solicitamos que compareça à clínica no horário agendado com os documentos de identificação em mãos.`;

        const linhas = doc.splitTextToSize(texto, 170);
        doc.text(linhas, 20, 115);

        const dataAtual = new Date();
        const dataHoje = dataAtual.toLocaleDateString('pt-BR');
        doc.text(`Avenida das Rosas, Nº 135. Recife PE ${dataHoje}`, 20, 160);

        doc.save(`agendamento_${agendamento.numeroAtendimento}.pdf`);
        return doc;
    }

    async enviarEmailConfirmacao(agendamento, emailTutor) {
        const templateParams = {
            to_email: emailTutor,
            tutor_nome: agendamento.tutor,
            pet_nome: agendamento.pet,
            pet_raca: agendamento.raca,
            pet_peso: agendamento.peso,
            tipo_atendimento: agendamento.tipo,
            numero_atendimento: agendamento.numeroAtendimento,
            data_agendamento: `${agendamento.dataObj.dia}/${agendamento.dataObj.mes}/${agendamento.dataObj.ano}`,
            hora_agendamento: agendamento.dataObj.hora,
            observacoes: agendamento.observacoes || 'Nenhuma'
        };

        try {
            const response = await emailjs.send(
                EMAIL_CONFIG.SERVICE_ID, 
                EMAIL_CONFIG.TEMPLATE_ID, 
                templateParams
            );
            console.log('Email enviado com sucesso!', response);
            alert('Email de confirmação enviado com sucesso!');
            return true;
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            alert('Erro ao enviar email: ' + (error.text || 'Verifique suas configurações'));
            return false;
        }
    }

    async enviarEmail(id) {
        const agendamento = this.agendamentos.find(a => a.id === id);
        if (!agendamento) return;
        
        const emailInput = document.getElementById('emailTutor');
        let emailTutor = emailInput ? emailInput.value : '';
        
        if (!emailTutor) {
            emailTutor = prompt('Digite o email do tutor para envio da confirmação:');
        }
        
        if (!emailTutor) return;
        
        await this.enviarEmailConfirmacao(agendamento, emailTutor);
    }
}

// Inicializa o gerenciador
const manager = new AgendamentoManager();

document.getElementById('agendamentoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const dados = {
        tutor: document.getElementById('nomeTutor').value,
        pet: document.getElementById('nomePet').value,
        raca: document.getElementById('racaPet').value,
        peso: document.getElementById('pesoPet').value,
        tipo: document.getElementById('tipoAtendimento').value,
        dataAgendamento: document.getElementById('dataAgendamento').value,
        observacoes: document.getElementById('observacoes').value
    };
    
    if (!dados.tutor || !dados.pet || !dados.raca || !dados.peso || !dados.tipo || !dados.dataAgendamento) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }
    
    // Adiciona o agendamento
    manager.adicionarAgendamento(dados);
    
    // Limpa o formulário
    e.target.reset();
    
    alert('Agendamento realizado com sucesso!');
});

// Carrega a lista inicial
manager.atualizarLista();

window.addEventListener('load', () => {
    if (typeof window.jspdf === 'undefined') {
        console.warn('[WARN] jsPDF não carregou. Verifique sua conexão com a internet.');
    } else {
        console.log('jsPDF carregado com sucesso!');
    }
    
    if (typeof emailjs === 'undefined') {
        console.warn('[WARN] EmailJS não carregou. Verifique sua conexão com a internet.');
    } else {
        console.log('EmailJS carregado com sucesso!');
    }
});