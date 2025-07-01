import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { MainLayout } from "@/components/shared/MainLayout";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export default async function ReceiptPage({ params }: { params: { id: string } }) {
  const session = await getServerSession();
  
  if (!session) {
    notFound();
  }
  
  const { id } = params;
  
  // Sanitize the ID to prevent directory traversal attacks
  const sanitizedId = id.replace(/[^a-zA-Z0-9-]/g, '');
  const receiptFilename = `receipt-${sanitizedId}.pdf`;
  const receiptPath = path.join(process.cwd(), 'public', 'receipts', receiptFilename);
  
  try {
    // Check if file exists
    await fs.access(receiptPath);
    
    // This page will just display the PDF with an option to download
    return (
      <MainLayout>
        <div className="container mx-auto py-8 md:py-12 px-4 md:px-6">
          <header className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Payment Receipt</h1>
            <p className="mt-2 text-lg text-muted-foreground">Your receipt is ready to view or download.</p>
          </header>

          <div className="flex flex-col items-center justify-center mb-8">
            <Button variant="outline" asChild className="mb-6">
              <a href={`/receipts/${receiptFilename}`} download>
                <FileDown className="mr-2 h-4 w-4" /> Download Receipt (PDF)
              </a>
            </Button>
            
            <iframe 
              src={`/receipts/${receiptFilename}`} 
              className="w-full max-w-4xl h-[700px] border rounded-lg shadow-lg"
              title="Payment Receipt"
            />
          </div>
        </div>
      </MainLayout>
    );
  } catch (error) {
    notFound();
  }
}
