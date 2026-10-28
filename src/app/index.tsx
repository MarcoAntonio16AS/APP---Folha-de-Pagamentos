import { useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


// Definição da estrutura dos dados
interface FolhaPagamento {
  codigotrab: number;
  nometrab: string;
  salariotrab: number;
}

export default function App() {
  const [dados, setDados] = useState<FolhaPagamento[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  // Busca os dados da API ao carregar o componente
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      setErro(null);

      //Os dados estão salvos em um json a parte. Necessário mudar o link.
      const response = await fetch('https://mfpledon.com.br/dadostrab.json');

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const json = await response.json();

      // Extrai a lista do campo 'folhapagamento'
      if (json.folhapagamento && Array.isArray(json.folhapagamento)) {
        setDados(json.folhapagamento);
      } else if (Array.isArray(json)) {
        setDados(json);
      } else {
        setDados([json]);
      }
    } catch (err: any) {
      setErro(err.message || 'Ocorreu um erro ao buscar os dados.');
    } finally {
      setCarregando(false);
    }
  };

  // Renderização do estado de carregamento
  if (carregando) {
    return (
      <View style={[styles.container, styles.centralizado]}>
        <ActivityIndicator size="large" color="#6f4e37" />
        <Text style={styles.textoCarregando}>Carregando funcionários...</Text>
      </View>
    );
  }

  // Renderização do estado de erro
  if (erro) {
    return (
      <View style={[styles.container, styles.centralizado]}>
        <Text style={styles.textoErro}>Falha ao carregar dados:</Text>
        <Text style={styles.subtextoErro}>{erro}</Text>
      </View>
    );
  }

  // Renderização principal dos dados
  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={dados}        
        keyExtractor={(item, index) =>
            item.codigotrab ? String(item.codigotrab) : String(index)
        }
        contentContainerStyle={styles.lista}

        ListHeaderComponent={
          <View>
            <Text style={styles.titulo}>Folha de Pagamentos</Text>
            <Text style={styles.textoCreditos}>Copyright Marco Antônio de Araujo Santos, 28/10/2026</Text>
          </View>
        }

        renderItem={({ item }) => (  // método da FlatList, para renderização de cada item da lista    
          <View style={styles.card}>
            {/* Cabeçalho com o nome do produto */}
            <Text style={styles.nometrab}>{item.nometrab}</Text>

            {/* Detalhes chamados diretamente */}
            <Text style={styles.campoExtra}>
              <Text style={{ fontWeight: 'bold' }}>Código:</Text> {item.codigotrab}
            </Text>

            <Text style={styles.campoExtra}>
              <Text style={{ fontWeight: 'bold' }}>Nome:</Text> {item.nometrab}
            </Text>

            <Text style={styles.campoExtra}>
              <Text style={{ fontWeight: 'bold' }}>Salário:</Text> R$ {
                typeof item.salariotrab === 'number' 
                  ? item.salariotrab.toFixed(2) 
                  : item.salariotrab
              }
            </Text>
          </View>
        )}

      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f5f2',
    paddingTop: 60, // Afasta o conteúdo para não ficar embaixo da barra do Expo Starter
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3e2723',
    textAlign: 'center',
    marginTop: 20,
    zIndex: 10, // Garante que fique por cima de qualquer camada
  },
  centralizado: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0d6d0',
    elevation: 2, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nometrab: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4e342e',
  },
  preco: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
    marginTop: 4,
  },
  descricao: {
    fontSize: 14,
    color: '#616161',
    marginTop: 6,
  },
  campoExtra: {
    fontSize: 13,
    color: '#757575',
    marginTop: 4,
  },
  textoCarregando: {
    marginTop: 10,
    fontSize: 16,
    color: '#6f4e37',
  },
  textoErro: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c62828',
  },
  subtextoErro: {
    fontSize: 14,
    color: '#b71c1c',
    marginTop: 6,
    textAlign: 'center',
  },
  textoCreditos: {
    fontSize: 10,
    color: '#666',
    marginTop: 30,
    marginBottom: 30,
    textAlign: 'center',
  }
});
