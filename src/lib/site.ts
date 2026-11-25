export const WHATSAPP_NUMBER = '5500000000000';
export const WHATSAPP_DISPLAY = '(00) 00000-0000';

export const wa = (text = 'Olá! Quero conversar sobre um projeto.') =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export type Service = {
  id: string;
  name: string;
  short: string;
  text: string;
  cta: string;
  message: string;
  visual: 'site' | 'landing' | 'redesign' | 'local';
};

export const SERVICES: Service[] = [
  {
    id: 'institucional',
    name: 'Site institucional',
    short: 'Site institucional',
    text: 'Sua empresa com um endereço profissional na internet. Um site bonito, rápido e fácil de achar, que passa confiança e mostra tudo o que o cliente quer saber antes de te chamar.',
    cta: 'Quero meu site',
    message: 'Olá! Quero um site institucional para a minha empresa.',
    visual: 'site'
  },
  {
    id: 'landing',
    name: 'Landing page',
    short: 'Landing page',
    text: 'Uma página feita pra vender um produto, serviço ou apenas mostrar informações. Direta ao ponto, ela guia o visitante até o botão e transforma quem só está olhando em cliente.',
    cta: 'Quero vender mais',
    message: 'Olá! Quero uma landing page para vender mais.',
    visual: 'landing'
  },
  {
    id: 'redesign',
    name: 'Redesign de site',
    short: 'Redesign',
    text: 'Seu site está com cara de antigo? Você me conta o que não gosta e eu deixo ele moderno, rápido e funcionando bem no celular, sem você perder o que já tem.',
    cta: 'Quero renovar meu site',
    message: 'Olá! Quero renovar o meu site.',
    visual: 'redesign'
  },
  {
    id: 'google-instagram',
    name: 'Marketing digital',
    short: 'Marketing',
    text: 'Faça seu negócio aparecer quando o cliente procura no Google. Eu coloco sua empresa no mapa, cuido do seu Google Meu Negócio e crio anúncios no Google e no Instagram pra trazer mais clientes.',
    cta: 'Quero mais clientes',
    message: 'Olá! Quero marketing digital para trazer mais clientes.',
    visual: 'local'
  }
];

export const STEPS = [
  { title: 'Conversa', text: 'Você conta pelo WhatsApp o que o seu negócio precisa.' },
  { title: 'Orçamento', text: 'Você recebe o que entra no site, o prazo e o valor.' },
  { title: 'Construção', text: 'Eu desenho e programo. Você vê o site e pede ajustes.' },
  { title: 'No ar', text: 'O site é publicado no seu domínio.' }
];

export const FAQ = [
  {
    q: 'Quanto custa um site?',
    a: 'Depende do que entra no projeto. O valor vem no orçamento, depois da primeira conversa.'
  },
  {
    q: 'Quanto tempo leva?',
    a: 'Depende do tamanho do site. O prazo vem junto com o orçamento.'
  },
  {
    q: 'Preciso ter domínio e hospedagem?',
    a: 'Não precisa chegar com nada pronto. Eu ajudo a registrar o domínio e a configurar a hospedagem.'
  },
  {
    q: 'O site funciona no celular?',
    a: 'Sim. O site é feito primeiro para o celular e depois ajustado para o computador.'
  },
  {
    q: 'Você cuida do Google e do Instagram também?',
    a: 'Sim, é um dos serviços. Dá para contratar junto com o site ou separado.'
  }
];

export const NAV = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Trabalhos', href: '#trabalhos' },
  { label: 'Processo', href: '#processo' },
  { label: 'Dúvidas', href: '#duvidas' }
];
