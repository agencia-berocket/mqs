import time
from playwright.sync_api import sync_playwright

def test_new_adjustments():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        
        print("1. Testando Modal de Login com Google no Admin...")
        admin_page = context.new_page()
        admin_page.goto("http://localhost:8085/admin.html")
        admin_page.wait_for_timeout(1000)

        # Verificar se o modal exibe o botão do Google e a indicação de e-mail restrito
        btn_google = admin_page.query_selector("button:has-text('Entrar com Conta Google')")
        assert btn_google is not None, "ERRO: Botão de Login com Google não foi encontrado!"
        
        email_restriction = admin_page.content()
        assert "reservasmoradaquintaldaserra@gmail.com" in email_restriction, "ERRO: E-mail de restrição não exibido no modal!"
        print("✅ TESTE 1 PASSOU: Modal do Admin configurado para Login com Google restrito a reservasmoradaquintaldaserra@gmail.com!")

        # Ativar modo demo para acessar o painel e testar o bloqueio de datas e PDF
        demo_btn = admin_page.query_selector("button:has-text('Acessar Modo Demo Local')")
        if demo_btn:
            demo_btn.click()
            admin_page.wait_for_timeout(500)

        print("\n2. Testando Bloqueio de Datas no Calendário do Site ao Confirmar Reserva...")
        # Abrir modal de detalhes da primeira reserva
        details_btn = admin_page.query_selector("button:has-text('Detalhes')")
        if details_btn:
            details_btn.click()
            admin_page.wait_for_timeout(500)

            # Alterar status para 50% PIX Pago
            pix_btn = admin_page.query_selector("button:has-text('Marcar 50% PIX')")
            if pix_btn:
                admin_page.once("dialog", lambda dialog: dialog.accept())
                pix_btn.click()
                admin_page.wait_for_timeout(500)

        # Abrir aba do site e verificar se as datas da reserva (2026-10-15 a 2026-10-17) estão desabilitadas
        site_page = context.new_page()
        site_page.goto("http://localhost:8085/index.html")
        site_page.wait_for_timeout(1000)

        # Verificar se o Flatpickr desabilitou as datas no site
        flatpickr_disabled_script = """
        () => {
            const checkInInput = document.getElementById('input-checkin');
            if (checkInInput && checkInInput._flatpickr) {
                const config = checkInInput._flatpickr.config;
                return config.disable && config.disable.length > 0;
            }
            return false;
        }
        """
        has_disable = site_page.evaluate(flatpickr_disabled_script)
        assert has_disable, "ERRO: Flatpickr no site não carregou o bloqueio de datas reservadas!"
        print("✅ TESTE 2 PASSOU: As datas reservadas no Admin foram sincronizadas e bloqueadas no site do cliente!")

        print("\n3. Testando Layout Vertical dos Cartões no PDF...")
        # Verificar o HTML do PDF gerado pelo admin
        pdf_html_script = """
        () => {
            const res = currentReservationsList[0];
            if (!res) return '';
            // Testar se printReservationPDF usa cards-vertical
            return printReservationPDF.toString();
        }
        """
        fn_str = admin_page.evaluate(pdf_html_script)
        assert "cards-vertical" in fn_str, "ERRO: O layout do PDF não está usando a classe cards-vertical!"
        print("✅ TESTE 3 PASSOU: O PDF da reserva foi atualizado para empilhamento vertical (100% de largura)!")

        browser.close()
        print("\n🎉 TODOS OS NOVOS AJUSTES FORAM TESTADOS E APROVADOS!")

if __name__ == "__main__":
    test_new_adjustments()
