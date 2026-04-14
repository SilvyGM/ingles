import { AppShell } from '@/components/AppShell';
import { ResourceCrud } from '@/components/ResourceCrud';
import { RESOURCE_MAP, type ResourceKey } from '@/lib/resources';

type CrudPageProps = {
  params: Promise<{ resource: string }>;
};

export default async function CrudPage({ params }: CrudPageProps) {
  const { resource } = await params;
  const key = resource as ResourceKey;
  const title = RESOURCE_MAP[key]?.label ?? 'CRUD';
  const subtitle = RESOURCE_MAP[key]?.description ?? 'Gestion del recurso';

  return (
    <AppShell subtitle={subtitle} title={title}>
      <ResourceCrud resource={resource} />
    </AppShell>
  );
}
