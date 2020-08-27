# QuantME Modeling and Transformation Framework

[![Build Status](https://travis-ci.com/UST-QuAntiL/QuantME-TransformationFramework.svg?branch=develop)](https://travis-ci.com/UST-QuAntiL/QuantME-TransformationFramework)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modeling solution for BPMN 2.0-based workflow models that need to integrate quantum applications.
It is based on [Quantum4BPMN](https://github.com/UST-QuAntiL/QuantME-Quantum4BPMN), a BPMN extension to support the Quantum Modeling Extension (QuantME).

Therefore, it enables to create workflow models orchestrating classical and quantum applications and to transform these workflow models to standard-compliant BPMN to retain their portability.

Please refer to the [documentation](./docs) for details of the possible usage of the framework to model and transform Quantum4BPMN workflow models.

### Building the Application

```sh
# install dependencies
npm install

# execute all checks (lint, test and build)
npm run all

# build the application to ./dist
npm run build
```

### Development Setup

First, build the plugins and then spin up the application for development:

```
npm run dev
```

## License

MIT

Based on the [Camunda Modeler](https://github.com/camunda/camunda-modeler) and uses [bpmn-js](https://github.com/bpmn-io/bpmn-js), [dmn-js](https://github.com/bpmn-io/dmn-js), and [cmmn-js](https://github.com/bpmn-io/cmmn-js), licensed under the [bpmn.io license](http://bpmn.io/license).
