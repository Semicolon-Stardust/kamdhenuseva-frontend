import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

interface AccordionData {
  id: string;
  title: string;
  content: string;
}

interface DynamicAccordionProps {
  items: AccordionData[];
}

export default function DynamicAccordion({ items }: DynamicAccordionProps) {
  return (
    <Accordion type="single" collapsible>
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          {/* Make accordion title white */}
          <AccordionTrigger className="flex items-center justify-between py-4 text-lg font-medium text-white transition-colors duration-300 hover:text-gray-200">
            {item.title}
          </AccordionTrigger>

          {/* Make accordion content white */}
          <AccordionContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm text-white">
            <div className="pt-0 pb-4">{item.content}</div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
