/**
 * About (brief 9.3): the mission as one statement, the story in the third
 * person (no personal details, SR-08), the founder video, leadership, the
 * eleven departments, the four values (faith values only when switched on
 * in Site settings, D8), and the Tanke office.
 */
import Link from 'next/link';

import type { Metadata } from 'next';

import { CtaBand } from '@/components/cta-band';
import { JsonLd } from '@/components/json-ld';
import { Marquee } from '@/components/marquee';
import { MotionScope } from '@/components/motion';
import { PageHero } from '@/components/page-hero';
import { Photo } from '@/components/photo';
import { SectionHead } from '@/components/section-head';
import { VideoCard } from '@/components/video-card';
import { WhatsAppLink } from '@/components/whatsapp-cta';

import {
  getDepartments,
  getSettings,
  getTeam,
  getVideosFor,
} from '@/lib/content';
import { videoNode } from '@/lib/jsonld';

import { values } from '@/data/copy';
import { images } from '@/data/images';

const title = 'About Jaylead AgriEstate: Our Mission and Story';

const description =
  'The story behind Jaylead AgriEstate, an Ilorin agribusiness turning Nigerian farmland into long-term wealth.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/about' },
  openGraph: { title, description, url: '/about' },
};

export default async function About() {
  const [settings, team, departments, founder, office] = await Promise.all([
    getSettings(),
    getTeam(),
    getDepartments(),
    getVideosFor('founder-story'),
    getVideosFor('about-office'),
  ]);

  const story = founder[0];
  const crumbs = [{ name: 'About', path: '/about' }];

  return (
    <MotionScope>
      <JsonLd
        path="/about"
        title={title}
        description={description}
        crumbs={crumbs}
        type="AboutPage"
        extra={story ? [videoNode(story)] : []}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="About Jaylead"
        title={[
          { text: 'Building the next century of' },
          { text: 'Nigerian wealth,', className: 'em-oil' },
          { text: 'one farm at a time.' },
        ]}
      />

      <section className="mx-auto max-w-[96rem] px-(--gutter) pb-28 md:pb-40">
        <p className="micro mb-10 opacity-70">Our mission</p>
        <p
          data-motion="ink"
          className="font-display text-statement max-w-[30ch]"
        >
          {settings.mission}
        </p>
      </section>

      <section className="on-ink bg-ink text-bone grain">
        <div className="mx-auto grid max-w-[96rem] gap-16 px-(--gutter) py-28 md:grid-cols-[1fr_minmax(0,24rem)] md:items-center md:gap-24 md:py-40">
          <div>
            <SectionHead
              index="01"
              eyebrow="Our story"
              title={
                <>
                  A personal plan <span className="em-oil">grew.</span>
                </>
              }
            />
            <div className="text-lede text-sand mt-10 grid max-w-2xl gap-6">
              <p>
                Jaylead AgriEstate Limited is an Ilorin agribusiness that sells
                titled oil-palm farmland and farms it for its owners. It was
                built on a simple idea: Nigeria has the land and the climate to
                grow far more of its own palm oil, and ordinary people should be
                able to own a share of that land.
              </p>
              <p>
                Its founder, Adetunji Jacob Ogunyemi, grew up around farming,
                where the food on the table came straight from the farm. He
                became a software engineer and worked with several companies
                until the AI shift changed his industry and he was laid off. In
                the months that followed he kept asking what could earn people
                an income without their day-to-day involvement.
              </p>
              <p>
                The answer was oil palm. His first plan was a large farm of his
                own, harvested from the third year. Over time that personal
                agenda grew into a collective one: an estate where owners buy
                titled land, Jaylead plants and manages it, and a larger share
                of each farm’s revenue goes to its owner.
              </p>
            </div>
          </div>
          {story ? (
            <div data-motion="tilt">
              <VideoCard
                video={story}
                sizes="(min-width: 768px) 384px, 100vw"
                className="[&_p]:text-sand"
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-[96rem] px-(--gutter) py-28 md:py-40">
        <SectionHead
          index="02"
          eyebrow="Leadership"
          title="Who leads Jaylead."
        />
        <ul className="mt-16 grid gap-16 md:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <li key={m._id}>
              {m.photo ? (
                <div className="overflow-hidden">
                  <div data-motion="unmask">
                    <Photo
                      image={m.photo}
                      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                      aspect={4 / 5}
                    />
                  </div>
                </div>
              ) : null}
              <h3 className="font-display mt-6 text-3xl">{m.name}</h3>
              <p className="micro mt-2 opacity-70">{m.role}</p>
              <p className="text-small mt-4 opacity-85">{m.bio}</p>
            </li>
          ))}
          <li className="self-end border-t border-current/20 pt-6">
            <p className="font-display em-oil text-2xl">
              More of the team, soon.
            </p>
            <p className="text-small mt-3 opacity-75">
              Profiles for our heads of Agriculture, Finance and Sales will
              appear here.
            </p>
          </li>
        </ul>
      </section>

      <Marquee items={departments.map((d) => d.name)} />

      <section className="mx-auto max-w-[96rem] px-(--gutter) py-28 md:py-40">
        <SectionHead
          index="03"
          eyebrow="How we’re organised"
          title={`${departments.length} departments, one farm.`}
        />
        <ol
          data-motion="stagger"
          className="mt-14 grid border-t border-current/20 sm:grid-cols-2 lg:grid-cols-3"
        >
          {departments.map((d, i) => (
            <li
              key={d._id}
              className="flex gap-5 border-b border-current/15 py-5 sm:pr-8"
            >
              <span className="micro tabular pt-1.5 opacity-60">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-display text-2xl">{d.name}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-bone-deep">
        <div className="mx-auto max-w-[96rem] px-(--gutter) py-28 md:py-40">
          <SectionHead
            index="04"
            eyebrow="Our values"
            title="What we hold to."
          />
          <ol
            data-motion="tilt"
            className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((v, i) => (
              <li key={v.title} className="border-t border-current/25 pt-6">
                <p className="micro tabular opacity-60">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display mt-4 text-3xl">{v.title}</h3>
                <p className="text-small mt-4 opacity-85">{v.body}</p>
              </li>
            ))}
          </ol>
          {settings.showFaithValues && settings.faithValues.length ? (
            <div className="mt-24">
              <p className="micro opacity-70">Our core values</p>
              <ol className="mt-8 grid gap-8 md:grid-cols-2">
                {settings.faithValues.map((v) => (
                  <li key={v.title} className="border-t border-current/20 pt-5">
                    <h3 className="font-display text-2xl">{v.title}</h3>
                    <p className="text-small mt-2">{v.description}</p>
                    <p className="micro mt-2 opacity-60">{v.reference}</p>
                  </li>
                ))}
              </ol>
              <Photo
                image={images['core-values-board']}
                sizes="(min-width: 768px) 40vw, 100vw"
                aspect={1}
                className="mt-10 max-w-md overflow-hidden"
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-[96rem] px-(--gutter) py-28 md:py-40">
        <SectionHead
          index="05"
          eyebrow="Our office"
          title={
            <>
              Opened September 2026 in{' '}
              <span className="em-oil">Tanke, Ilorin.</span>
            </>
          }
          lede={`${settings.address.line1}, ${settings.address.landmarkDirections}, ${settings.address.city}. Monday to Friday, 9am to 5pm. Come in, meet the team and see the documents for yourself.`}
        />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div data-motion="depth" data-motion-depth="0.2">
            <Photo
              image={images['office-before']}
              sizes="(min-width: 768px) 30vw, 100vw"
              aspect={4 / 5}
              showCaption
              className="overflow-hidden"
            />
          </div>
          <div data-motion="depth" data-motion-depth="0.6" className="md:mt-24">
            <Photo
              image={images['office-logo-wall']}
              sizes="(min-width: 768px) 30vw, 100vw"
              aspect={4 / 5}
              className="overflow-hidden"
            />
            <p className="micro mt-3 opacity-70">After: the finished office</p>
          </div>
          <div
            data-motion="depth"
            data-motion-depth="0.35"
            className="md:mt-10"
          >
            <Photo
              image={images['founder-opening-day']}
              sizes="(min-width: 768px) 30vw, 100vw"
              aspect={4 / 5}
              className="overflow-hidden"
            />
            <p className="micro mt-3 opacity-70">Opening day</p>
          </div>
        </div>
        {office.length ? (
          <ul className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {office.map((v) => (
              <li key={v.key}>
                <VideoCard
                  video={v}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                />
              </li>
            ))}
          </ul>
        ) : null}
        <Link
          href="/blog/jaylead-office-launch-tanke-ilorin"
          className="link-under mt-12 inline-block"
        >
          Read about the launch
        </Link>
      </section>

      <CtaBand
        title={
          <>
            Visit <span className="em-oil">the office.</span>
          </>
        }
      >
        <WhatsAppLink template="office-visit">
          Plan an office visit
        </WhatsAppLink>
        <Link href="/marketplace" className="pill pill-ghost">
          See the marketplace
        </Link>
      </CtaBand>
    </MotionScope>
  );
}
