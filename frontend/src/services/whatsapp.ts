export interface GenerateWhatsAppProduct {
  title?: string;
  parentSku?: string;
  price?: number;
  color?: string;
  titulo?: string;
  skuPai?: string;
  preco?: number;
  cor?: string;
}

export interface GenerateWhatsAppFavoriteItem {
  title?: string;
  parentSku?: string;
  price?: number;
  titulo?: string;
  skuPai?: string;
  preco?: number;
}

export interface GenerateWhatsAppParams {
  phone?: string;
  product?: GenerateWhatsAppProduct;
  type?: 'purchase' | 'prescription' | 'inquiry' | 'favorites_list' | 'compra' | 'grau' | 'duvida' | 'lista_favoritos';
  favoriteProducts?: GenerateWhatsAppFavoriteItem[];
  numero?: string;
  produto?: GenerateWhatsAppProduct;
  tipo?: 'purchase' | 'prescription' | 'inquiry' | 'favorites_list' | 'compra' | 'grau' | 'duvida' | 'lista_favoritos';
  produtosFavoritos?: GenerateWhatsAppFavoriteItem[];
}

export function generateWhatsAppLink({
  phone,
  product,
  type,
  favoriteProducts,
  numero,
  produto,
  tipo,
  produtosFavoritos,
}: GenerateWhatsAppParams): string {
  const activePhone = phone || numero || process.env.NEXT_PUBLIC_WHATSAPP_NUMERO || '84996160968';
  const activeProduct = product || produto;
  const activeType = type || tipo || 'inquiry';
  const activeFavorites = favoriteProducts || produtosFavoritos || [];

  const cleanedPhone = activePhone.replace(/\D/g, '');
  let message = '';

  const prodTitle = activeProduct?.title || activeProduct?.titulo || '';
  const prodSku = activeProduct?.parentSku || activeProduct?.skuPai || '';
  const prodPrice = activeProduct?.price ?? activeProduct?.preco ?? 0;
  const prodColor = activeProduct?.color || activeProduct?.cor;

  if ((activeType === 'purchase' || activeType === 'compra') && activeProduct) {
    const formattedPrice = prodPrice.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    const colorText = prodColor ? ` na cor *${prodColor}*` : '';
    message = `Olá, equipe TS EYEWEAR! 🕶👓\n\nTenho interesse no modelo *${prodTitle}* (Ref: ${prodSku})${colorText} anunciado por ${formattedPrice}.\n\nGostaria de confirmar a disponibilidade e fechar meu pedido com Frete Grátis para todo o Brasil!`;
  } else if ((activeType === 'prescription' || activeType === 'grau') && activeProduct) {
    message = `Olá, TS EYEWEAR! 👓\n\nGostei da armação *${prodTitle}* (Ref: ${prodSku}) e gostaria de cotar minhas lentes de grau com vocês.\n\nComo posso enviar a foto da minha receita oftalmológica?`;
  } else if ((activeType === 'favorites_list' || activeType === 'lista_favoritos') && activeFavorites.length > 0) {
    const formattedList = activeFavorites
      .map((item, index) => {
        const itemTitle = item.title || item.titulo || '';
        const itemSku = item.parentSku || item.skuPai || '';
        const itemPrice = item.price ?? item.preco ?? 0;
        return `${index + 1}. *${itemTitle}* (Ref: ${itemSku}) - ${itemPrice.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}`;
      })
      .join('\n');

    message = `Olá, TS EYEWEAR! 🕶\n\nSeparei alguns modelos favoritos no catálogo online e gostaria de tirar dúvidas sobre eles:\n\n${formattedList}\n\nPoderiam me ajudar a escolher o ideal pro meu formato de rosto?`;
  } else {
    message = `Olá, TS EYEWEAR! Estava navegando no catálogo online e gostaria de falar com um consultor óptico.`;
  }

  return `https://wa.me/55${cleanedPhone}?text=${encodeURIComponent(message)}`;
}

export const gerarLinkWhatsApp = generateWhatsAppLink;
export type GerarWhatsAppParams = GenerateWhatsAppParams;
