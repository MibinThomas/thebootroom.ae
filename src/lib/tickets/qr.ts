import QRCode from "qrcode";
export async function makeQrDataUrl(value:string){return QRCode.toDataURL(value,{margin:1,width:260});}
