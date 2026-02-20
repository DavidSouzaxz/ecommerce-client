import { useEffect, useState, useRef, useCallback } from "react";
import api from "../../services/api";

// Função de fallback para apito simples caso o arquivo falhe
const beepFallback = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 880; // A5
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.error("Fallback audio error", e);
  }
};

const OrdersManager = ({ slug, tenant }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [lastPendingCount, setLastPendingCount] = useState(0);
  const audioRef = useRef(new Audio("/notification.mp3"));

  const enableAudio = () => {
    const audio = audioRef.current;
    audio
      .play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        setAudioEnabled(true);
        console.log("Áudio desbloqueado com sucesso!");
      })
      .catch((err) => {
        console.error("O navegador ainda bloqueou o áudio:", err);
      });
  };

  const fetchOrders = useCallback(async () => {
    try {
      const response = await api.get(`/api/orders/tenant/${slug}`);
      const currentOrders = response.data;
      const pendingOrders = currentOrders.filter(
        (o) => o.status === "PENDENTE",
      );

      // LOGICA DE DISPARO
      if (pendingOrders.length > lastPendingCount && audioEnabled) {
        console.log("Novo pedido! Tentando tocar som...");
        const audio = audioRef.current;
        audio.currentTime = 0;
        
        // Tenta tocar o MP3, se der erro (NotSupportedError), usa o beep
        audio.play().catch((e) => {
          console.warn("Erro ao tocar arquivo de áudio. Usando fallback:", e);
          beepFallback();
        });
      }

      setOrders(currentOrders);
      setLastPendingCount(pendingOrders.length);
    } catch (err) {
      console.error("Erro ao carregar pedidos", err);
    } finally {
      setLoading(false);
    }
  }, [slug, audioEnabled, lastPendingCount]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/orders/${id}/status`, status, {
        headers: { "Content-Type": "text/plain" },
      });
      fetchOrders();
    } catch (err) {
      alert("Erro ao atualizar status");
    }
  };

  if (loading)
    return <div className="p-10 text-center">Carregando pedidos...</div>;

  const totalFaturamento = orders.reduce((acc, o) => acc + o.totalValue, 0);

  return (
    <div>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Gestão de Pedidos
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Pedidos da loja:{" "}
            <span
              className="font-semibold "
              style={{ color: tenant.primaryColor }}
            >
              {tenant.name}
            </span>
          </p>
        </div>
        {!audioEnabled && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4 flex justify-between items-center">
            <p className="text-yellow-700 text-sm font-bold">
              ⚠️ O alerta sonoro de novos pedidos está desativado.
            </p>
            <button
              onClick={enableAudio}
              className="bg-yellow-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-yellow-600"
            >
              ATIVAR SOM
            </button>
          </div>
        )}
      </header>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 transition-colors"
          style={{ borderColor: tenant.primaryColor }}
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">
            Vendas Hoje
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            R$ {totalFaturamento.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-blue-500 transition-colors">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">
            Total Pedidos
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {orders.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-yellow-500 transition-colors">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">
            Aguardando
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {orders.filter((o) => o.status === "PENDENTE").length}
          </p>
        </div>
      </div>

      {/* Tabela de Pedidos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
            <tr>
              <th className="p-4 font-bold text-gray-600 dark:text-gray-300 text-sm">
                PEDIDO
              </th>
              <th className="p-4 font-bold text-gray-600 dark:text-gray-300 text-sm">
                CLIENTE / WHATSAPP
              </th>
              <th className="p-4 font-bold text-gray-600 dark:text-gray-300 text-sm">
                ENDEREÇO DE ENTREGA
              </th>
              <th className="p-4 font-bold text-gray-600 dark:text-gray-300 text-sm">
                TOTAL / PGTO
              </th>
              <th className="p-4 font-bold text-gray-600 dark:text-gray-300 text-sm text-center">
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="p-4">
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                    #{order.id}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 dark:text-white">
                      {order.customerName}
                    </span>
                    {/* Link direto para o WhatsApp do cliente */}
                    <a
                      href={`https://wa.me/55${order.customerPhone?.replace(/\D/g, "")}`}
                      target="_blank"
                      className="text-xs text-green-600 dark:text-green-400 font-bold hover:underline flex items-center gap-1"
                    >
                      📱 {order.customerPhone}
                    </a>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 max-w-[250px] leading-tight italic">
                    {order.customerAddress}
                  </p>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-black text-gray-900 dark:text-white">
                      R$ {order.totalValue.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded self-start mt-1 dark:text-gray-300">
                      {order.paymentMethod}
                    </span>
                  </div>
                </td>
                <td className="p-4 flex justify-center gap-2">
                  {order.status === "PENDENTE" && (
                    <button
                      onClick={() => updateStatus(order.id, "EM PREPARO")}
                      className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg font-bold hover:cursor-pointer"
                    >
                      ACEITAR
                    </button>
                  )}
                  {order.status === "EM PREPARO" && (
                    <button
                      onClick={() => updateStatus(order.id, "FINALIZADO")}
                      className="bg-green-600 text-white text-xs px-4 py-2 rounded-lg font-bold hover:cursor-pointer"
                    >
                      FINALIZAR
                    </button>
                  )}
                  {order.status === "FINALIZADO" && (
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Concluído
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersManager;
