import { Card } from '@heroui/card';
import { Button } from '@heroui/button';

import { Meteors } from '@/components/ui/meteors';
import { BorderBeam } from '@/components/ui/border-beam';
import { NeonGradientCard } from '@/components/ui/neon-gradient-card';
import { title, subtitle } from '@/components/primitives';

import { GoogleIcon } from '@/components/icons';

export default async function Page() {
  return (
    <>
      {/* <Image
        alt="Card background"
        className="object-cover"
        src="/LOGOTIPO_PRINCIPAL.png"
        width={300}
      /> */}
      <Card className="relative mt-16 flex max-w-xl flex-col items-center justify-center px-4 py-12 pb-8 text-center">
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
            <span className={title({ color: 'green' })}> Financiero</span>
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-2">
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
          <div className="text-sm font-light text-default-300">
            Inica sesión para continuar
          </div>
        </div>
      </Card>
    </>
  );
}
