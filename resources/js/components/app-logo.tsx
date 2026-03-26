export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md     text-sidebar-primary-foreground">
                <img src="/storage/logo.png" alt="hrtv" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm text-sidebar-foreground">
                <span className="mb-0.5 truncate font-semibold leading-none">HRTV</span>
            </div>
        </>
    );
}
