import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button, ButtonGroup } from "@heroui/button";
import { button as buttonStyles } from "@heroui/theme";

import { Link } from "@heroui/link";
import { title, subtitle } from "@/components/primitives";

import { Image } from "@heroui/image";
import { siteConfig } from "@/config/site";

export default async function Page() {
  return (
    <>
      {/* <Image
        alt="Card background"
        className="object-cover"
        src="/LOGOTIPO_PRINCIPAL.png"
        width={300}
      /> */}
      <Card
        className="py-12  pb-16 px-4  mt-16
       flex flex-col max-w-xl text-center justify-center items-center gap-4"
      >
        <div>
          <p className={title()}>Connect English</p>
          <p>
            <span className={title()}> Monitor</span>
            <span className={title({ color: "green" })}> Financiero</span>
          </p>
        </div>
        <div className={subtitle({ class: "m-0 p-0" })}>
          Inica sesión para continuar
        </div>

        <a href="/login/google">
          <Button color="success" variant="shadow">
            Acceder con Google
          </Button>
        </a>
      </Card>
    </>
  );
}
