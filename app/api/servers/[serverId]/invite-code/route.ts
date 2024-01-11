import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
  try {
    if (!params.serverId) return new NextResponse("ServerId missing", { status: 400 });
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthroized", { status: 401 });

    const server = await db.server.update({
      where: { id: params.serverId, profileId: profile.id },
      data: { inviteCode: uuidv4() },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
