import { GoogleIcon } from '@/components/icons';
import { BorderBeam } from '@/components/ui/border-beam';
import { Meteors } from '@/components/ui/meteors';
import { validateRequest } from '@/lib/auth';
import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
import { Image } from '@heroui/image';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { user } = await validateRequest();
  if (!user) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 px-2 py-8 md:py-10">
        <Card className="relative mt-16 flex w-full max-w-md flex-col items-center justify-center px-4 pb-8 pt-2 text-center">
          <Meteors />
          <BorderBeam
            size={250}
            duration={12}
            delay={9}
            colorFrom="#17c964"
            colorTo="#17c964"
            borderWidth={2}
          />
          <Image
            alt="Card background"
            className="logoImageWhite object-cover backdrop-grayscale-0"
            src="/white.png"
            width={170}
            isBlurred
          />
          <Image
            alt="Card background"
            className="logoImageColor object-cover backdrop-grayscale-0"
            src="/color.png"
            width={170}
          />
          <div>
            <p className="mt-2 text-3xl md:text-4xl">
              <span className="inline font-semibold tracking-tight">
                {' '}
                Monitor
              </span>
              <span className="inline bg-gradient-to-b from-[#6FEE8D] to-[#17c964] bg-clip-text font-semibold tracking-tight text-transparent">
                {' '}
                Financiero
              </span>
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-2">
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
      </section>
    );
  } else {
    return redirect('/monitor');
  }
}
