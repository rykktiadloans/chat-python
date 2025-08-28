
interface Props {
  originalName: string;
  storedName: string;
}

const imageExtensions = [
  "amf",
  "bmp",
  "exif",
  "gif",
  "ico",
  "jpeg",
  "jpg",
  "png",
  "raw",
  "svg",
  "tiff",
  "webp",
];

function isImage(path: string): boolean {
  for(let ext of imageExtensions) {
    if (path.endsWith(ext)) {
      return true;
    }
  }
  return false;
}

function Attachment({originalName, storedName}: Props) {
  if (!isImage(originalName)) {
    return <div><a className="underline" target="_blank" href={`/api/v1/attachments/${storedName}`}>{originalName}</a></div>
  }
  return <img className="rounded-md" src={`/api/v1/attachments/${storedName}`} alt={originalName} />

}

export default Attachment;
