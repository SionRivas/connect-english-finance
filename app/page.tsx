import { GoogleIcon } from '@/components/icons';
import { BorderBeam } from '@/components/ui/border-beam';
import { Meteors } from '@/components/ui/meteors';
import { validateRequest } from '@/lib/auth';
import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
import { Image } from '@heroui/image';
import { redirect } from 'next/navigation';
import { title, subtitle } from '@/components/primitives';

export default async function Home() {
  const { user } = await validateRequest();
  if (!user) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg justify-center text-center">
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
              <Button
                color="success"
                size="lg"
                as={'a'}
                href="/login/google"
                className="text-white"
                variant="shadow"
              >
                Acceder con Google
                <GoogleIcon />
              </Button>
              <div className="text-sm font-light text-default-300">
                Inica sesión para continuar
              </div>
            </div>
          </Card>
        </div>
      </section>
    );
  } else {
    return redirect('/monitor');
  }
}
