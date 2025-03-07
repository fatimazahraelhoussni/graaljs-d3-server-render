## Integrating D3.js with GraalJS in Spring Boot

The example below demonstrates how to execute D3.js JavaScript code within a Java Spring Boot application using GraalJS.

## Prerequisites

To follow this guide, you will need the following:

-   GraalVM JDK
-   Node.js and npm (for D3.js dependencies)
-   Maven

## 1. Maven Project Setup

Use an existing Spring Boot project or create a new one.

### 1.1. Adding Polyglot API and GraalJS Dependencies

The GraalVM Polyglot API can be easily added as a Maven dependency to your Java project. The GraalJS artifact should also be present on the Java module or classpath.

Add the following set of dependencies to the `<dependencies>` section of your `pom.xml`:

```xml
<dependencies>
    <dependency>
        <groupId>org.graalvm.polyglot</groupId>
        <artifactId>polyglot</artifactId>
        <version>24.1.2</version>
    </dependency>
    <dependency>
        <groupId>org.graalvm.polyglot</groupId>
        <artifactId>js</artifactId>
        <version>24.1.2</version>
        <type>pom</type>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-thymeleaf</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

### 1.2. Configuring the `frontend-maven-plugin` Maven Plugin

Add the `frontend-maven-plugin` plugin to the `<build>` section of the `pom.xml` to install Node.js, npm, and JavaScript dependencies during the Maven build phase:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>com.github.eirslett</groupId>
            <artifactId>frontend-maven-plugin</artifactId>
            <version>1.12.1</version>
            <configuration>
                <nodeVersion>v18.17.1</nodeVersion>
                <npmVersion>9.7.2</npmVersion>
            </configuration>
            <executions>
                <execution>
                    <id>install node and npm</id>
                    <goals>
                        <goal>install-node-and-npm</goal>
                    </goals>
                    <phase>generate-resources</phase>
                </execution>
                <execution>
                    <id>npm install</id>
                    <goals>
                        <goal>npm</goal>
                    </goals>
                    <phase>generate-resources</phase>
                    <configuration>
                        <arguments>install</arguments>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

## 2. JavaScript Code Configuration (D3.js)

Next, write a D3.js JavaScript function.

### 2.1. Writing the JavaScript Code

Place the following JavaScript program in `src/main/resources/static/graph.js`:

```javascript
var d3 = require('./node_modules/d3/dist/d3.js');
var linkedom = require('linkedom');

globalThis.document = linkedom.parseHTML('<html><body></body></html>').document;

const width = 640;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

const x = d3.scaleUtc()
    .domain([new Date("2023-01-01"), new Date("2024-01-01")])
    .range([marginLeft, width - marginRight]);

const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height - marginBottom, marginTop]);

const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x));

svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y));

module.exports = svg.node().outerHTML;
```

## 3. Using the JavaScript Module from Java

You can now integrate this JavaScript function into a Java application. Place the following code in `src/main/java/com/example/d3demo/GraphService.java`:

```java
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Source;
import org.graalvm.polyglot.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class GraphService {

    public String generateGraph() throws IOException {
        String jsCode = new String(Files.readAllBytes(Paths.get("src/main/resources/static/graph.js")));
        try (Context context = Context.newBuilder("js").allowAllAccess(true).build()) {
            context.eval("js", "if (typeof globalThis.linkedom === 'undefined') { " +
                    "globalThis.linkedom = require('linkedom'); " +
                    "globalThis.document = linkedom.parseHTML('<html><body></body></html>').document; }");
            Value result = context.eval("js", jsCode);
            return result.asString();
        }
    }
}
```

## 4. Building and Testing the Application

Compile and run this Java application with Maven:

```bash
./mvnw package
./mvnw spring-boot:run
```

Open your browser and navigate to `http://localhost:8080/graph`.

## Conclusion

By following this guide, you have learned how to:

-   Execute D3.js JavaScript code within a Java application using GraalJS.
-   Use `linkedom` to simulate the DOM environment on the server side.
-   Integrate JavaScript dependencies into a Maven project.

