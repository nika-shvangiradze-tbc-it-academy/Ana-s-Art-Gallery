import { Component, signal } from '@angular/core';

type FaqEntry = { id: string; question: string; answer: string };

@Component({
  selector: 'app-faq',
  imports: [],
  templateUrl: './art-faq.html',
  styleUrl: './art-faq.scss',
})
export class ArtFaq {
  protected readonly openId = signal<string | null>(null);

  protected readonly items: FaqEntry[] = [
    {
      id: 'faq-1',
      question: 'Can I order a custom artwork based on my own imagination?',
      answer:
        'Yes. Custom artworks can be created based on the customer’s idea, mood, story, or imagination. You can share your vision, and the artwork can be designed in Ana’s artistic style.',
    },
    {
      id: 'faq-2',
      question: 'How long does it take to create a custom artwork?',
      answer:
        'The creation time depends on the size, detail, and complexity of the artwork. Usually, a custom piece may take several days to a few weeks.',
    },
    {
      id: 'faq-3',
      question: 'What materials are used to create the artworks?',
      answer:
        'Ana works with drawing and painting materials such as pencils, colored pencils, watercolor, acrylics, markers, and mixed media, depending on the artwork style.',
    },
    {
      id: 'faq-4',
      question: 'Can handmade dolls be ordered in a custom style?',
      answer:
        'Yes. Handmade dolls can be created with different clothing styles, inspired by Georgian traditions or designed according to the customer’s personal wishes.',
    },
    {
      id: 'faq-5',
      question: 'Is delivery available?',
      answer:
        'Yes. Delivery is available across Georgia. Delivery details, timing, and cost can be discussed before ordering.',
    },
    {
      id: 'faq-6',
      question: 'How can I buy an artwork?',
      answer:
        'You can choose an available artwork from the gallery and contact us through the phone number or email provided on the website.',
    },
    {
      id: 'faq-7',
      question: 'Can I request Georgian traditional style artwork?',
      answer:
        'Yes. Artworks and handmade dolls can be inspired by Georgian culture, traditional clothing, colors, and visual details.',
    },
    {
      id: 'faq-8',
      question: 'Are all artworks original?',
      answer: 'Yes. Each artwork is original and created with Ana’s personal artistic vision.',
    },
  ];

  protected toggle(id: string): void {
    this.openId.update((cur) => (cur === id ? null : id));
  }

  protected isOpen(id: string): boolean {
    return this.openId() === id;
  }
}
