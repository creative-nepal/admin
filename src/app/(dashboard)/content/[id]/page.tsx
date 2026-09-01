import { PageEditorView } from "@/features/content/views/page-editor-view";

export default async function ContentPageEditor({
  params,
}: PageProps<"/content/[id]">) {
  const { id } = await params;

  return <PageEditorView pageId={id} />;
}
