import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { memberId: string } }) {
  try {
    if (!params.memberId) return new NextResponse("MemberId missing", { status: 400 });

    const profile = await currentProfile();
    if (!profile) return new NextResponse("Umauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!serverId) return new NextResponse("ServerId missing", { status: 400 });

    const { role } = await req.json();

    const server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: { members: { update: { where: { id: params.memberId, profileId: { not: profile.id } }, data: { role } } } },
      include: { members: { include: { profile: true }, orderBy: { role: "asc" } } },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { memberId: string } }) {
  try {
    if (!params.memberId) return new NextResponse("MemberId missing", { status: 401 });

    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId) return new NextResponse("ServerID missing", { status: 401 });

    const server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: { members: { deleteMany: { id: params.memberId, profileId: { not: profile.id } } } },
      include: { members: { include: { profile: true }, orderBy: { role: "asc" } } },
    });

    return NextResponse.json({ server });
  } catch (error) {
    console.log("[MEMBER_ID_DELETE]: ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
