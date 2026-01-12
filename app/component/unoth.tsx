export default function Unauthorized() {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <h1 className="text-2xl font-bold text-red-600">🚫 Unauthorized Access</h1>
                <p className="mt-2 text-gray-600">
                    only admin accsess this page 
                </p>
            </div>
        </div>
    );
}
