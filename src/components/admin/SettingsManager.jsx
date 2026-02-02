const SettingsManager = ({ tenant }) => {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-black text-gray-800">Configurações</h1>
        <p className="text-gray-500">
          Gerencie as configurações da loja {tenant?.name}
        </p>
      </header>

      <div className="bg-white p-8 rounded-xl shadow-sm text-center py-20">
        <p className="text-gray-400 text-lg">
          Área de configurações em construção.
        </p>
      </div>
    </div>
  );
};

export default SettingsManager;
