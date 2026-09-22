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
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Navegação">
        <Link href="/">Início</Link>
        <span>/</span>
        <span>Institucional</span>
      </nav>

      {/* Hero Header */}
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

      {/* Seção Quem Somos */}
      <section className={styles.section}>
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

        {/* Box Legal */}
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

      {/* Pilares e Diferenciais */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Nossos Compromissos</h2>
        <div className={styles.pillarsGrid}>
          <div className={styles.pillarCard}>
            <div className={styles.pillarIcon}>
              <Truck size={24} />
            </div>
            <h4>Frete Grátis Brasil</h4>
            <p>
              Envio gratuito sem valor mínimo de pedido para qualquer CEP do território nacional,
              com rastreamento ponto-a-ponto via Correios.
            </p>
          </div>

          <div className={styles.pillarCard}>
            <div className={styles.pillarIcon}>
              <ShieldCheck size={24} />
            </div>
            <h4>Garantia de 90 Dias</h4>
            <p>
              Segurança total com garantia legal de 90 dias contra defeitos de fabricação em todas
              as armações do nosso catálogo.
            </p>
          </div>

          <div className={styles.pillarCard}>
            <div className={styles.pillarIcon}>
              <RefreshCw size={24} />
            </div>
            <h4>Troca Fácil (7 Dias)</h4>
            <p>
              Direito de arrependimento em até 7 dias corridos após o recebimento, com a primeira troca
              totalmente por nossa conta.
            </p>
          </div>

          <div className={styles.pillarCard}>
            <div className={styles.pillarIcon}>
              <Package size={24} />
            </div>
            <h4>Embalagem Premium</h4>
            <p>
              Seus óculos viajam protegidos em caixa rígida exclusiva TS EYEWEAR com estojo e
              flanela de microfibra personalizada.
            </p>
          </div>

          <div className={styles.pillarCard}>
            <div className={styles.pillarIcon}>
              <Headphones size={24} />
            </div>
            <h4>Atendimento Humanizado</h4>
            <p>
              Consultores especialistas prontos para tirar dúvidas sobre formatos de rosto e lentes de
              grau via WhatsApp.
            </p>
          </div>

          <div className={styles.pillarCard}>
            <div className={styles.pillarIcon}>
              <CheckCircle2 size={24} />
            </div>
            <h4>Materiais Selecionados</h4>
            <p>
              Armações construídas com acetato usinado, metal hipoalergênico e charneiras reforçadas
              para máxima durabilidade.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section}>
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

      {/* CTA WhatsApp */}
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
