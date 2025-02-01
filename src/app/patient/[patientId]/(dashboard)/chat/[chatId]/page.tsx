import fs from "fs";
import path from "path";
import ChatComponent from "./chatComponent";

export default async function CharacterPage({
  params,
}: {
  params: { characterId: string };
}) {
  console.log("Received characterId:", params.characterId);


  return (
    <div>
      <ChatComponent chatId={params.characterId} />
    </div>
  );
}
