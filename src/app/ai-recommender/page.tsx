
import { MainLayout } from '@/components/shared/MainLayout';
import { AIProgramRecommender } from '@/components/application/AIProgramRecommender';

export default function AIRecommenderPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4 md:px-6">
        <AIProgramRecommender />
      </div>
    </MainLayout>
  );
}
