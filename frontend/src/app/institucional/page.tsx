'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  ShieldCheck,
  RefreshCw,
  Package,
  Headphones,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Ruler,
  Lock,
  FileText,
} from 'lucide-react';
import { WhatsAppIcon } from '../../components/Icons';
import { gerarLinkWhatsApp } from '../../services/whatsapp';
import styles from './institucional.module.css';

export default function InstitucionalPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Como funciona a compra de armações 100% online?',
      a: 'Navegue pelo nosso catálogo exclusivo, confira as fotos reais em alta definição com visão 45º e as medidas exatas de aro, ponte e haste em milímetros. Ao escolher o modelo desejado, basta clicar no botão de WhatsApp para ser atendido diretamente por um de nossos especialistas ópticos, que confirmará seu endereço e gerará seu pedido com Frete Grátis Brasil.',
    },
    {
      q: 'Vocês também fazem as lentes de grau?',
      a: 'Sim! Além da armação, você pode cotar e confeccionar suas lentes de grau conosco. Basta enviar uma foto legível da sua receita médica oftalmológica atualizada pelo WhatsApp. Nossa equipe calculará a melhor espessura e tratamento (antirreflexo, filtro de luz azul, fotossensível) para a sua dioptria.',
    },
    {
      q: 'Como sei se a armação vai servir confortavelmente no meu rosto?',
      a: 'Em cada produto você encontra a aba "Tabela de Medidas Exatas" com Aro (largura da lente), Ponte (espaço nasal) e Haste (comprimento lateral). Você pode comparar essas medidas com um óculos que você já use confortavelmente. Além disso, disponibilizamos um Guia Interativo de Medidas no site.',
    },
    {
      q: 'Como funciona a garantia e a política de trocas?',
      a: 'Você tem garantia total de 90 dias contra qualquer defeito de fabricação. Além disso, conforme o Artigo 49 do Código de Defesa do Consumidor, oferecemos 7 dias corridos após o recebimento para troca ou devolução sem custo adicional da primeira troca.',
    },
    {
      q: 'Qual é o prazo e custo de envio?',
      a: 'O frete é 100% GRÁTIS para qualquer cidade e estado do Brasil, sem valor mínimo de pedido! Enviamos via Correios com código de rastreamento enviado diretamente no seu WhatsApp para você acompanhar cada etapa até a entrega na sua porta.',
    },
  ];

  const linkWhatsApp = gerarLinkWhatsApp({ tipo: 'duvida' });

  return (
    <div className={styles.institucionalContainer}>
      <nav className={styles.breadcrumb} aria-label="Navegação">
        <Link href="/">Início</Link>
        <span>/</span>
        <span>Institucional</span>
      </nav>

      <header className={styles.heroHeader}>
        <span className={styles.badge}>5 Anos de Tradição & Inovação</span>
        <h1 className={styles.heroTitle}>
          Elegância, Precisão e Atendimento Humano em Cada Detalhe
        </h1>
        <p className={styles.heroSubtitle}>
          A TS EYEWEAR nasceu para descomplicar sua experiência de escolha de óculos de grau e solares,
          unindo design contemporâneo, materiais nobres e a comodidade do frete grátis para todo o Brasil.
        </p>
      </header>

      <section id="historia" className={styles.section}>
        <h2 className={styles.sectionTitle}>Nossa História</h2>
        <div className={styles.storyCard}>
          <p>
            Com mais de <strong>5 anos de história e dedicação exclusiva ao segmento óptico</strong>,
            a TS EYEWEAR construiu uma reputação sólida baseada em qualidade rigorosa, acabamento impecável
            e transparência absoluta com seus clientes.
          </p>
          <p>
            Atuamos no formato <strong>100% online</strong>, conectando o público a armações modernas em
            acetato premium, titânio ultraleve, TR-90 flexível e ligas metálicas anticorrosivas.
            Eliminamos intermediários e custos físicos desnecessários para entregar uma curadoria de
            alto padrão com o melhor custo-benefício do mercado nacional.
          </p>
          <p>
            Cada armação é revisada manualmente por nossos técnicos antes do envio, acompanhada de estojo
            rígido protetor e flanela de microfibra, garantindo uma experiência de desembalagem sofisticada
            e segura.
          </p>
        </div>

        <div className={styles.legalBox}>
          <div className={styles.legalItem}>
            <h5>Razão Social</h5>
            <p>TS comércio de óculos e negócios Ltda</p>
          </div>
          <div className={styles.legalItem}>
            <h5>CNPJ Oficial</h5>
            <p>50.879.437/0001-37</p>
          </div>
          <div className={styles.legalItem}>
            <h5>Operação & Atendimento</h5>
            <p>100% Online • Brasil</p>
          </div>
        </div>
      </section>

      <section id="medidas" className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Ruler size={24} style={{ color: 'var(--color-accent)' }} />
          Guia de Medidas da Armação
        </h2>
        <div className={styles.storyCard}>
          <p>
            Escolher óculos pela internet é simples quando você conhece as 3 medidas universais gravadas na haste interna de qualquer armação:
          </p>

          <div className={styles.medidasGrid}>
            <div className={styles.medidaCard}>
              <span className={styles.medidaNumber}>1. Aro (Largura da Lente)</span>
              <h4 className={styles.medidaTitle}>Largura Horizontal (ex: 52 mm)</h4>
              <p className={styles.medidaDesc}>
                Determina se o modelo é tamanho <strong>P</strong> (até 50 mm), <strong>M</strong> (51 a 54 mm) ou <strong>G</strong> (55 mm ou superior). Ideal para harmonizar com a largura do seu rosto.
              </p>
            </div>

            <div className={styles.medidaCard}>
              <span className={styles.medidaNumber}>2. Ponte Nasal</span>
              <h4 className={styles.medidaTitle}>Espaço Nasal (ex: 18 mm)</h4>
              <p className={styles.medidaDesc}>
                A distância entre as duas lentes sobre o nariz. Garante apoio anatômico perfeito sem escorregar e sem causar marcas incômodas.
              </p>
            </div>

            <div className={styles.medidaCard}>
              <span className={styles.medidaNumber}>3. Comprimento da Haste</span>
              <h4 className={styles.medidaTitle}>Haste Lateral (ex: 140 mm)</h4>
              <p className={styles.medidaDesc}>
                O comprimento total que vai da charneira frontal até a curvatura atrás da orelha. A média confortável para adultos varia entre 135 mm e 145 mm.
              </p>
            </div>
          </div>

          <div className={styles.medidaTip}>
            <strong>Como conferir no seu óculos atual:</strong> Olhe na parte interna de uma das hastes da sua armação atual. Você verá números como <code>52◽18 140</code>. Eles correspondem exatamente ao Aro, Ponte e Haste. Ao comprar na TS EYEWEAR, compare com essas referências para garantir o encaixe perfeito.
          </div>
        </div>
      </section>

      <section id="frete" className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Truck size={24} style={{ color: 'var(--color-accent)' }} />
          Frete Grátis para Todo o Brasil
        </h2>
        <div className={styles.storyCard}>
          <p>
            Na TS EYEWEAR, a comodidade é prioridade. Todos os pedidos contam com <strong>Frete 100% Grátis</strong> para qualquer CEP do território nacional, sem exigência de valor mínimo.
          </p>
          <div className={styles.pillarsGrid}>
            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <Truck size={24} />
              </div>
              <h4>Envio via Correios</h4>
              <p>Modalidades PAC e SEDEX seguras com postagem ágil e seguro contra extravio em todas as encomendas.</p>
            </div>
            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <Package size={24} />
              </div>
              <h4>Rastreamento Ponto a Ponto</h4>
              <p>Assim que seu pedido é postado, você recebe o código de rastreio oficial diretamente no seu WhatsApp para acompanhar o trajeto.</p>
            </div>
            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <Headphones size={24} />
              </div>
              <h4>Suporte no Envio</h4>
              <p>Qualquer dúvida sobre a entrega pode ser consultada a qualquer momento com nossos atendentes pelo WhatsApp.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="garantias" className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <ShieldCheck size={24} style={{ color: 'var(--color-accent)' }} />
          Garantia e Qualidade
        </h2>
        <div className={styles.storyCard}>
          <p>
            Trabalhamos exclusivamente com armações 100% originais construídas com matérias-primas de alta durabilidade e lentes com proteção certificada.
          </p>
          <div className={styles.pillarsGrid}>
            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <ShieldCheck size={24} />
              </div>
              <h4>Garantia Total de 90 Dias</h4>
              <p>Cobertura completa contra qualquer defeito de fabricação em armações, charneiras e lentes.</p>
            </div>
            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <CheckCircle2 size={24} />
              </div>
              <h4>Proteção UV400 Certificada</h4>
              <p>Todas as lentes solares e clip-ons possuem filtro UV400 que bloqueia 100% dos raios UVA e UVB prejudiciais à retina.</p>
            </div>
            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <Package size={24} />
              </div>
              <h4>Estojo Rígido & Flanela</h4>
              <p>Todos os óculos acompanham estojo de proteção e flanela especial de microfibra antiarranhão.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="trocas" className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <RefreshCw size={24} style={{ color: 'var(--color-accent)' }} />
          Trocas e Devoluções
        </h2>
        <div className={styles.storyCard}>
          <p>
            Queremos que você se sinta 100% seguro ao escolher seu modelo. Por isso, oferecemos uma política de troca simples e sem burocracia:
          </p>
          <p>
            <strong>Prazo de 7 Dias Corridos:</strong> Conforme o Artigo 49 do Código de Defesa do Consumidor, você tem até 7 dias corridos após o recebimento para solicitar a troca ou devolução do produto sem uso, acompanhado de sua embalagem e acessórios originais.
          </p>
          <p>
            <strong>Primeira Troca por Nossa Conta:</strong> Geramos o código de logística reversa dos Correios para que você envie a armação sem qualquer custo de postagem.
          </p>
          <p>
            <strong>Como Solicitar:</strong> Basta enviar uma mensagem para nosso WhatsApp oficial <code>(11) 98772-9981</code> informando o número do seu pedido. Nossa equipe providencia a substituição com agilidade.
          </p>
        </div>
      </section>

      <section id="privacidade" className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Lock size={24} style={{ color: 'var(--color-accent)' }} />
          Privacidade & Segurança de Dados (LGPD)
        </h2>
        <div className={styles.storyCard}>
          <p>
            A TS EYEWEAR trata a privacidade e a segurança das suas informações com o mais alto rigor técnico e ético:
          </p>
          <p>
            <strong>Receitas Oftalmológicas:</strong> Os dados de saúde contidos nas prescrições médicas enviadas pelo cliente são classificados como dados sensíveis pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Eles são utilizados de forma confidencial e estritamente para o cálculo técnico da sua dioptria e faturamento dos óculos.
          </p>
          <p>
            <strong>Ambiente Criptografado SSL:</strong> Nosso catálogo opera sob protocolo seguro HTTPS com certificado SSL de 256 bits, garantindo que toda a navegação e transmissão de dados ocorram em canal protegido.
          </p>
          <p>
            <strong>Não Compartilhamento:</strong> Seus dados pessoais e de contato jamais serão vendidos, alugados ou compartilhados com terceiros sem sua expressa autorização.
          </p>
        </div>
      </section>

      <section id="faq" className={styles.section}>
        <h2 className={styles.sectionTitle}>Dúvidas Frequentes</h2>
        <div className={styles.faqList}>
          {faqs.map((faq, idx) => (
            <div key={idx} className={styles.faqItem}>
              <button
                type="button"
                className={styles.faqQuestion}
                onClick={() => toggleFaq(idx)}
                aria-expanded={openFaq === idx}
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {openFaq === idx && <div className={styles.faqAnswer}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      <div className={styles.contactCta}>
        <h3>Precisa de ajuda para escolher sua armação?</h3>
        <p>
          Fale diretamente com nossa equipe de consultores ópticos no WhatsApp. Estamos prontos para
          analisar sua receita e indicar o tamanho perfeito para o seu rosto.
        </p>
        <a
          href={linkWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btnCtaWhatsApp}
        >
          <WhatsAppIcon size={22} />
          Falar com um Consultor no WhatsApp
        </a>
      </div>
    </div>
  );
}
