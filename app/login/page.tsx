import { Card } from "@heroui/card";
import { Button } from "@heroui/button";

import { Meteors } from "@/components/ui/meteors";
import { BorderBeam } from "@/components/ui/border-beam";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { title, subtitle } from "@/components/primitives";

import { GoogleIcon } from "@/components/icons";

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
        className="relative py-12  pb-8 px-4  mt-16
       flex flex-col max-w-xl text-center justify-center items-center "
      >
        <Meteors />
        <BorderBeam
          size={250}
          duration={12}
          delay={9}
          colorFrom="#17c964"
          colorTo="#17c964"
          borderWidth={2}
        />
        <div>
          <p className={title()}>Connect English</p>
          <p>
            <span className={title()}> Monitor</span>
            <span className={title({ color: "green" })}> Financiero</span>
          </p>
        </div>

        <div className="flex flex-col mt-8 gap-2">
          <a href="/login/google" className="">
            <Button
              color="success"
              size="lg"
              className="text-white"
              variant="shadow"
            >
              Acceder con Google
              <GoogleIcon />
            </Button>
          </a>
          <div
            className="text-default-300 font-light text-sm
          "
          >
            Inica sesión para continuar
          </div>
        </div>
      </Card>
    </>
  );
}
