'use client';
import Image from 'next/image';
import Link from 'next/link';
import Logo from 'public/next.svg';
import IconFont from '@_components/IconFont';
export default function NFTDetails() {
  return (
    <div className="nft-wrap">
      <div className="ntf-overview-wrap">
        <div className="nft-image-wrap">
          <Image src={Logo} alt="" className="nft-image" />
        </div>
        <div className="nft-detail-wrap">
          <div className="nft-title-wrap">
            <h1 className="nft-title">The Source by Camille Roux x Matthieu Segret</h1>
            <div className="nft-thumb">
              <div className="nft-thumb-image-wrap">
                <Image className="object-contain" fill src={Logo} alt="" />
              </div>
              <Link href="/" className="text-link">
                King Cards
              </Link>
            </div>
          </div>
          <div className="nft-detail">
            <div className="nft-detail-property">
              <div className="nft-detail-label">
                <div className="nft-detail-label-left">
                  <IconFont type="document" className="w-3 h-3" />
                  <span>Details</span>
                </div>
                <div className="nft-detail-label-right">
                  <IconFont type="Down" />
                </div>
              </div>
              <ul className="nft-detail-ul">
                <li className="nft-detail-item">
                  <div className="nft-detail-item-left">
                    <IconFont type="question-circle" />
                    <span>Holders:</span>
                  </div>
                  <div className="nft-detail-item-right">2232</div>
                </li>
                <li className="nft-detail-item">
                  <div className="nft-detail-item-left">
                    <IconFont type="question-circle" />
                    <span>Owners:</span>
                  </div>
                  <div className="nft-detail-item-right">
                    <span>5 Owners</span>
                    <IconFont type="Down" />
                  </div>
                </li>
                <li className="nft-detail-item">
                  <div className="nft-detail-item-left">
                    <IconFont type="question-circle" />
                    <span>Issuer:</span>
                  </div>
                  <div className="nft-detail-item-right">
                    <Image src={Logo} width={20} height={20} alt="" />
                    <span className="font-medium">forest</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="nft-detail-property">
              <div className="nft-detail-label">
                <div className="nft-detail-label-left">
                  <IconFont type="document" className="w-3 h-3" />
                  <span>Details</span>
                </div>
                <div className="nft-detail-label-right">
                  <IconFont type="Down" />
                </div>
              </div>
              <ul className="nft-detail-ul nft-detail-block-wrap">
                <li className="nft-detail-block">
                  <h1>Background</h1>
                  <h2>Yellow</h2>
                </li>
                <li className="nft-detail-block">
                  <h1>Background</h1>
                  <h2>Yellow</h2>
                </li>
                <li className="nft-detail-block">
                  <h1>Background</h1>
                  <h2>Yellow</h2>
                </li>
                <li className="nft-detail-block">
                  <h1>Background</h1>
                  <h2>Yellow</h2>
                </li>
              </ul>
            </div>

            <div className="nft-detail-property">
              <div className="nft-detail-label">
                <div className="nft-detail-label-left">
                  <IconFont type="document" className="w-3 h-3" />
                  <span>Details</span>
                </div>
                <div className="nft-detail-label-right">
                  <IconFont type="Down" />
                </div>
              </div>
              <div className="nft-detail-ul flex">
                <input type="checkbox" id="exp" className="nft-detail-txt-checkbox peer" />
                <div className="nft-detail-txt peer-checked:!line-clamp-none">
                  <label className="nft-detail-txt-more" htmlFor="exp">
                    See More
                  </label>
                  Into the Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a
                  collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the
                  Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a
                  collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the
                  Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a
                  collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the
                  Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the Metaverse is
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
