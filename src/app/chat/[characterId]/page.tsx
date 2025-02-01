import fs from "fs";
import path from "path";
import ChatComponent from "./chatComponent";

interface CharacterData {
  data: {
    name: string;
    description: string;
    personality: string;
    scenario: string;
    system_prompt: string;
    first_mes: string;
    avatar: string;
    tags: string[];
    extensions: {
      chub: {
        full_path: string;
      };
    };
  };
}

async function getCharacterData(
  characterId: string
): Promise<CharacterData | null> {
  const directory = path.join(process.cwd(), "src/chubJSONs");
  const files = fs.readdirSync(directory);


  for (const file of files) {
    const filePath = path.join(directory, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const characterData = JSON.parse(fileContent) as CharacterData;

    const fullPath = characterData.data.extensions?.chub?.full_path;
    if (fullPath) {
      const splitPath = fullPath.split("/");
      const characterFileId = splitPath[1];


      if (characterFileId === characterId) {
        console.log("Found character file:", file);
       

        return {
          data: {
            name: characterData.data.name,
            description: characterData.data.description,
            personality: characterData.data.personality,
            scenario: characterData.data.scenario,
            system_prompt: characterData.data.system_prompt,
            first_mes: characterData.data.first_mes,
            avatar: characterData.data.avatar,
            tags: characterData.data.tags,
            extensions: {
              chub: {
                full_path: characterFileId,
              },
            },
          },
        };
      }
    }
  }

  console.log("Character file not found");
  return null;
}

export default async function CharacterPage({
  params,
}: {
  params: { characterId: string };
}) {
  console.log("Received characterId:", params.characterId);
  const characterData = await getCharacterData(params.characterId);

  if (!characterData) {
    return <div>Character not found</div>;
  }

  return (
    <div>
      <ChatComponent characterData={characterData} />
    </div>
  );
}
