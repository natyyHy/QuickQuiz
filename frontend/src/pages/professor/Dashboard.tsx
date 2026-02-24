import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useAuth } from "@/contexts/AuthContext";
import { useQuiz } from "@/contexts/QuizContext";
import { toast } from "sonner";
import { Layout } from "@/components/layout";

export const ProfessorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { savedQuizzes, loadQuizzes, deleteQuiz } = useQuiz();

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: "",
    title: "",
  });
  const [startModal, setStartModal] = useState({
    isOpen: false,
    id: "",
    title: "",
  });

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  // Handlers Principais
  const actions = {
    handleLogout: () => {
      logout();
      toast.success("Logout realizado! Até logo!");
      navigate("/");
    },
    handleDelete: () => {
      deleteQuiz(deleteModal.id);
      toast.success(`"${deleteModal.title}" removido com sucesso.`);
      setDeleteModal({ isOpen: false, id: "", title: "" });
    },
    handleStart: () => {
      navigate(`/professor/quiz/sala/${startModal.id}`);
    },
  };

  const formatDate = (dateValue: Date | string | number) => {
    const date = new Date(dateValue);

    if (isNaN(date.getTime())) return "Data inválida";

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      <main className="relative z-[1] px-4 pt-32 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-4 border-[#4441AA]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-[#605BEF] mb-2">
                  Dashboard do Professor
                </h1>
                <p className="text-[#605BEF] font-bold text-lg">
                  Bem-vindo, {user?.name}!
                </p>
                <p className="text-[#605BEF] font-semibold opacity-80">
                  Gerencie seus quizzes aqui.
                </p>
              </div>
              <button
                onClick={actions.handleLogout}
                className="px-6 py-2 border-2 border-[#ee8697] text-[#ee8697] rounded-lg font-semibold hover:bg-[#ee8697] hover:text-white transition-all"
              >
                Sair
              </button>
            </div>

            <button
              onClick={() => navigate("/professor/quiz/criar/etapa-1")}
              className="w-full sm:w-auto bg-[#FFC000] text-[#605BEF] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#ffb800] transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              + Criar Novo Quiz
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-[#4441AA]">
            <h2 className="text-2xl font-bold text-[#605BEF] mb-6">
              Meus Quizzes ({savedQuizzes.length})
            </h2>

            {savedQuizzes.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg font-medium">Nenhum quiz criado ainda</p>
                <p className="text-sm">
                  Clique em "Criar Novo Quiz" para começar
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="bg-gradient-to-br from-[#605BEF] to-[#7B73E8] rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-[1.03]"
                  >
                    <div className="flex flex-col h-full text-white">
                      <h3 className="font-bold text-xl mb-4 line-clamp-2">
                        {quiz.config.titulo}
                      </h3>

                      <div className="flex-1 space-y-2 mb-6 opacity-90 text-sm">
                        <p>
                          📊 <b>Nível:</b> {quiz.config.nivel}
                        </p>
                        <p>
                          📝 <b>Questões:</b> {quiz.questoes.length}
                        </p>
                        <p>
                          ⏱️ <b>Tempo:</b> {quiz.config.tempoPorQuestao}s
                        </p>
                        <p>
                          📅 <b>Criado:</b> {formatDate(quiz.criadoEm)}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() =>
                            setStartModal({
                              isOpen: true,
                              id: quiz.id,
                              title: quiz.config.titulo,
                            })
                          }
                          className="w-full bg-[#00D9B5] hover:bg-[#00C9A5] py-3 rounded-lg font-bold shadow-md transition-colors"
                        >
                          🚀 Iniciar Quiz
                        </button>

                        <div className="flex gap-2">
                          <button
                            onClick={() => toast.info("Em breve!")}
                            className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-xs font-semibold transition-colors"
                          >
                            👁️ Ver
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                id: quiz.id,
                                title: quiz.config.titulo,
                              })
                            }
                            className="flex-1 bg-red-500/70 hover:bg-red-600 py-2 rounded-lg text-xs font-semibold transition-colors"
                          >
                            🗑️ Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={actions.handleDelete}
        title="Excluir Quiz"
        description={`Tem certeza que deseja excluir "${deleteModal.title}"?`}
        confirmText="Excluir"
      />

      <ConfirmModal
        isOpen={startModal.isOpen}
        onClose={() => setStartModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={actions.handleStart}
        title="Iniciar Quiz"
        description={`Deseja abrir a sala para "${startModal.title}"?`}
        confirmText="Iniciar"
        variant="success"
      />
    </Layout>
  );
};
