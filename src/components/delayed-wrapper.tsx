export async function DelayedWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return <>{children}</>;
}
