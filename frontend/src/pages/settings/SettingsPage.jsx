import DeleteAccount from "../../components/common/DeleteAccount";
import Theme from "../../components/common/Theme";

const SettingsPage = () => {
  return (
    <div className="flex-[1_1_0] mr-auto border-r border-gray-700 min-h-screen">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      <Theme />
      <DeleteAccount />
    </div>
  );
};

export default SettingsPage;
