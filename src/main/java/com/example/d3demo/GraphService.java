package com.example.d3demo;

import org.graalvm.polyglot.*;
import org.graalvm.polyglot.io.IOAccess;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class GraphService {

    public String generateGraph() throws IOException {
        String jsCode = new String(Files.readAllBytes(Paths.get("src/main/resources/static/graph.js")));

        try (Context context = Context.newBuilder("js")
                .allowIO(IOAccess.ALL)
                .allowExperimentalOptions(true)
                .option("js.commonjs-require", "true")
                .build()) {

            context.eval("js", "if (typeof globalThis.linkedom === 'undefined') { " +
                    "globalThis.linkedom = require('linkedom'); " +
                    "globalThis.document = linkedom.parseHTML('<html><body></body></html>').document; }");

            Value result = context.eval("js", jsCode);
            return result.asString();

        } catch (PolyglotException e) {
            System.err.println("Erreur JavaScript : " + e.getMessage());
            e.printStackTrace(); // Affiche la trace de la pile pour plus de détails
            throw new IOException("Erreur lors de l'exécution du code JavaScript : " + e.getMessage(), e);
        } catch (Exception e) {
            e.printStackTrace();
            throw new IOException("Erreur lors de l'exécution du code JavaScript", e);
        }
    }
}
