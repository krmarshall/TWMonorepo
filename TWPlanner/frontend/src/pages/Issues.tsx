import { useEffect } from 'react';
import IssuesSlider from '../components/IssuesSlider';
import useBulkMediaQueries from '../hooks/useBulkMediaQueries';
import placeholderImage from '../imgs/other/0placeholder.webp';

const Issues = () => {
  const { isShortWidth } = useBulkMediaQueries();
  const marginThickness = isShortWidth ? ' mx-2' : ' mx-32';

  useEffect(() => {
    document.title = 'Total Warhammer Planner - Issues';
  }, []);
  return (
    <div className="h-[88vh] bg-gray-700 w-full border border-gray-500 rounded-md px-2 py-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600">
      <div className={'flex flex-col place-content-center mt-4 select-text font-[Helvetica]' + marginThickness}>
        <div className="flex flex-row place-content-center">
          <hr className="grow mt-[1.6rem] opacity-50" />
          <h1 className="w-max text-center text-5xl mx-2 mb-2 text-gray-200 text-shadow">Report an Issue</h1>
          <hr className="grow mt-[1.6rem] opacity-50" />
        </div>
        <p className="text-center text-gray-200 text-2xl">
          If you think you&apos;ve found a bug or problem the easiest way to message me is on{' '}
          <a
            href="https://www.reddit.com/message/compose?to=Fearhorn&subject=&message="
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            Reddit
          </a>
          . Some notes to follow before messaging:
        </p>
        <ul className="list-disc list-inside mt-8 text-gray-200 text-2xl">
          <li>If the base game updated recently expect mods to be broken and/or outdated.</li>
          <li>Ensure the problem isn&apos;t already mentioned in the Known Issues section.</li>
          <li>
            Rank requirements are achieved 1 rank too early (eg. a skill with rank requirement of 10 can be selected
            when the character is rank 9). This is just a quirk of I chose to show the character rank, in game the
            character ranks up, unlocks requirements, then you get to choose where the point goes. With TWP you
            effectively rank up upon taking the skill. Allowing you to rank the skill 1 rank &quot;early&quot;
            effectively matches how the game works. If you find an instance where this doesnt match game behavior let me
            know.
          </li>
          <li>
            When sending a message please include the following details, or use this template:
            <div className="border border-gray-300 bg-gray-800 w-fit ml-8 p-2 pr-12 rounded-xl">
              Browser Used:
              <br />
              <br /> Game/Mod:
              <br />
              <br /> Faction and Character:
              <br />
              <br /> Description:
              <br />
              <br /> Steps to Reproduce (If Applicable):
            </div>
          </li>
          <li>
            If you are experiencing an issue using Safari or IE, try another browser such as Chrome or Firefox before
            reporting it.
          </li>
          <li>
            If it is related to a pink icon (
            <img src={placeholderImage} alt="placeholder image" width="59" height="59" className="inline w-6 h-6" />
            ), that is a placeholder icon. If this is somewhere in a tooltip it is probably related to a hidden skill
            effect. I&apos;ve decided to generally leave hidden or background effects in for more information, but might
            try to prune more empty entries at some point. Please do not report these unless you think it is a real
            error, such as a character portrait, or skill icon.
          </li>
        </ul>

        <div className="flex flex-row place-content-center mt-12">
          <hr className="grow mt-[1.6rem] opacity-50" />
          <h1 className="w-max text-center text-5xl mx-2 mb-2 text-gray-200 text-shadow">Known Issues</h1>
          <hr className="grow mt-[1.6rem] opacity-50" />
        </div>

        <ul className="list-disc list-inside text-gray-200 text-2xl">
          <li>Skill nodes that overlap indent and tier with another node have inconsistent behavior</li>
          <li>
            Tooltips that cant find horizontal space to fit in the viewport without conflicting with the cursor
            aren&apos;t visible
          </li>
          <li>Tooltips for Stat Drawer Abilities that vertically overflow the viewport are not scrollable</li>
          <li>Certain effects only have their first 3 abilities linked (eg. Vanilla 2 -CD to all Spells)</li>
          <IssuesSlider title="Warhammer 3" bg="bg-gray-600">
            <li>Belakor has duplicate Lord of Torment and Whispers in the Darkness skills in his tree</li>
            <li>Some poorly scaled skill icons depending on file path, mostly affects mods</li>
            <li>Mounts obtained as quest items do not have stats linked</li>
            <IssuesSlider title="Mods" bg="bg-gray-700">
              <li>
                Mixu 3 has several missing skill icons, and Wychwethyl&apos;s melee line is out of order, these are bugs
                in the mod itself
              </li>
              <li>
                Radious 3 Lord of the Admiralty Monster Hunter skill icon placeholder (and duplicate skill effect? seems
                like copying from broken base game skill?)
              </li>
            </IssuesSlider>
          </IssuesSlider>

          <IssuesSlider title="Warhammer 2" bg="bg-gray-600">
            <li>Faction Effects are not linked for WH2 Legendary Lords</li>
            <IssuesSlider title="Mods" bg="bg-gray-700">
              <li>Stopped extracting and hosting mods for WH2, sorry!</li>
            </IssuesSlider>
          </IssuesSlider>
        </ul>
      </div>
    </div>
  );
};

export default Issues;
