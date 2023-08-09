export default function HeadTitle({ content }: { content: string }) {
  return (
    <div className="py-5">
      <div className="text-xl font-bold not-italic text-base-100">{content}</div>
    </div>
  );
}
