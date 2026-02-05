import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { SocialLinks } from "@/components/ui/SocialLinks";

const faqs = [
  {
    question: "すみれさばとは何ですか？",
    answer:
      "すみれさばは、身内主導の、ゲーム・開発を主に行っている小規模なサーバーです。",
  },
  {
    question: "年齢制限はありますか？",
    answer:
      "Discordの利用規約に従い、13歳以上の方がご参加いただけます。",
  },
  {
    question: "ルールはありますか？",
    answer:
      "はい、サーバー内でルールを確認できます。基本的には他のメンバーへのリスペクトを持って、楽しくコミュニケーションをお願いします。",
  },
  {
    question: "サーモンは好きですか？",
    answer:
      "はい、サーモンを所持して不審な行動をしないでください。",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-6">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            よくある質問
          </h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            FAQ - Frequently Asked Questions
          </p>
        </div>

        {/* FAQ List */}
        <Accordion>
          {faqs.map((faq, index) => (
            <AccordionItem key={index} question={faq.question}>
              {faq.answer}
            </AccordionItem>
          ))}
        </Accordion>

        {/* Social Links */}
        <SocialLinks />
      </div>
    </div>
  );
}
