export default function SizeBytes({ size }: { size: number }) {
  return <span>{(size || '0').toLocaleString()} Bytes</span>;
}
