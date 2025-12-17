import prisma from '@/lib/client';
import DeleteUserButton from '@/components/admin/DeleteUserButton';
export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      apiaries: {
        include: {
          hives: {
            include: {
              observations: true,
            },
          },
        },
      },
    },
  });
  if (!user) return <div>Gebruiker niet gevonden</div>;
  return (
    <>
      <div style={{ marginTop: '6rem' }}>
        <h1>{user.name}</h1>
        <div>
          {user.apiaries.map(apiary => (
            <div key={apiary.id}>
              <div>{apiary.name}</div>
              <div>
                {apiary.hives.map(hive => (
                  <div key={hive.id}>
                    <div>{hive.type}</div>
                    <div>
                      {hive.observations.map(observation => (
                        <div key={observation.id}>
                          <h2>nummer: {observation.id} </h2>
                          <p>aantal bijen: {observation.beeCount}</p>
                          <p>kleur: {observation.pollenColor}</p>
                          <p>opmerkingen: {observation.notes}</p>
                          <p>datum: {observation.createdAt.toDateString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <DeleteUserButton userId={user.id} userName={user.name} />
      </div>
    </>
  );
}
