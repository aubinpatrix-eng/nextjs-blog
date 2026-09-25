import Container from "@/app/_components/container";
import { getSite } from "@/lib/site";

export function Footer() {
  const site = getSite();

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <Container>
        <div className="py-28 flex flex-col lg:flex-row items-center">
          <h3 className="text-4xl lg:text-[2.5rem] font-bold tracking-tighter leading-tight text-center lg:text-left mb-10 lg:mb-0 lg:pr-4 lg:w-1/2">
            {site.footerTitle}
          </h3>
          {site.footerLinkUrl && (
            <div className="flex flex-col lg:flex-row justify-center items-center lg:pl-4 lg:w-1/2">
              <a
                href={site.footerLinkUrl}
                className="mx-3 bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 lg:px-8 duration-200 transition-colors"
              >
                {site.footerLinkLabel}
              </a>
            </div>
          )}
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
